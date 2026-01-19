import { ForbiddenException, Injectable } from '@nestjs/common';
import {
  AddOrderDto,
  addOrderQuantity,
  CreateOrderDto,
} from './dto/create-order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { orderEntity } from 'src/model/order.entity';
import { DataSource, IsNull, Not, Repository } from 'typeorm';
import { sessionEntity } from 'src/model/session.entity';
import { tableEntity } from 'src/model/table.entity';
import {
  billingStatus,
  orderStatus,
  orderType,
  tableStatus,
} from 'src/helper/types/index.type';
import { orderItemEntity } from 'src/model/orderItem.entity';
import { productEntity } from 'src/model/Product.entity';
import { productAddOnEntity } from 'src/model/Product_Addon.entity';
import { orderItemAddOnEntity } from 'src/model/orderItemAddOn.entity';
import { billingEntity } from 'src/model/billing.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(tableEntity)
    private readonly tableRepositroy: Repository<tableEntity>,

    @InjectRepository(orderEntity)
    private readonly orderRepository: Repository<orderEntity>,

    @InjectRepository(orderItemEntity)
    private readonly orderItemRepository: Repository<orderItemEntity>,

    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>,

    @InjectRepository(productEntity)
    private readonly productRepository: Repository<productEntity>,

    @InjectRepository(tableEntity)
    private readonly tableRepository: Repository<tableEntity>,

    private dataSource: DataSource,
  ) {}

  clientUser = {};

  identifyClient(room: string, clientId: string) {
    this.clientUser[clientId] = room;
    return Object.values(this.clientUser);
  }

  getClientName(clientId: string) {
    return this.clientUser[clientId];
  }

  async create(restaurantId: string, createOrderDto: CreateOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { phone, table, remarks, orderInfo, type } = createOrderDto;

      // orderInfo.map((item) => {
      //   console.log('product:', item);
      //   item?.addOn?.map((addOn)=>{
      //     console.log(addOn);
      //   })
      // });

      const existingSession = await this.sessionRepository.findOne({
        where: {
          table: { id: table },
          endedAt: IsNull(),
        },
        relations: ['order'],
      });
      // console.log('phone:', phone);
      // console.log(existingSession);

      if (existingSession && existingSession.phone != phone) {
        return { success: false, msg: 'Phone number does not match.' };
      }

      if (existingSession) {
        // console.log('session exist');
        const addOrderBody: AddOrderDto = {
          orderId: existingSession.order.id,
          remarks: createOrderDto.remarks,
          orderInfo: createOrderDto.orderInfo,
        };
        const result = await this.addOrder(type, addOrderBody);
        return result;
      }

      // console.log('session does not exist');

      let session: sessionEntity;
      if (!existingSession) {
        session = new sessionEntity();
        session.phone = phone;
        session.table = { id: table } as tableEntity;
        await queryRunner.manager.update(
          tableEntity,
          { id: table },
          { status: tableStatus.occupied },
        );
        // Save the new session to the database
        await queryRunner.manager.save(session);
      } else {
        session = existingSession;
      }

      // Create a new order
      const order = new orderEntity();
      order.session = session;
      order.status =
        type == orderType.receptionist
          ? orderStatus.accepted
          : orderStatus.pending;
      order.type = type ?? orderType.table;
      order.remarks = remarks || null;
      order.restaurant = { id: restaurantId } as restaurantEntity;
      await queryRunner.manager.save(order);

      // Create and save order items
      const orderItems = orderInfo.map((item) => {
        const orderItem = new orderItemEntity();
        orderItem.product = { id: item.product } as productEntity;
        orderItem.quantity = item.quantity;
        orderItem.status =
          type == orderType.receptionist
            ? orderStatus.accepted
            : orderStatus.pending;
        orderItem.order = order;
        return orderItem;
      });

      // Save the order items
      const savedOrderItems = await queryRunner.manager.save(orderItems);

      // Create and save order item add-ons
      const orderItemAddOns = [];
      savedOrderItems.forEach((orderItem, index) => {
        const addOns = orderInfo[index].addOn.map((addon) => {
          const addOnEntity = new orderItemAddOnEntity();
          addOnEntity.quantity = addon.quantity;
          addOnEntity.orderItem = orderItem; // Set the order item relationship
          addOnEntity.productAddOn = {
            id: addon.addOnId,
          } as productAddOnEntity;
          return addOnEntity;
        });

        // Add all add-ons to the orderItemAddOns array
        orderItemAddOns.push(...addOns);
      });

      // Save the order item add-ons
      await queryRunner.manager.save(orderItemAddOns);

      const billing = new billingEntity();
      billing.order = order;
      (billing.status = billingStatus.unpaid),
        (billing.restaurant = { id: restaurantId } as restaurantEntity);
      billing.totalPaidAmount = 0;
      await queryRunner.manager.save(billing);

      // Commit the transaction
      await queryRunner.commitTransaction();
      return {
        success: true,
        orderId: order.id,
        tableId: table,
        msg: 'Order has been placed successfully.',
      };
    } catch (error) {
      // console.error(error);

      // Rollback the transaction in case of error
      await queryRunner.rollbackTransaction();
      return {
        success: false,
        msg: 'unable to place the order',
        tableId: createOrderDto.table,
      };
      // throw new ForbiddenException('Order creation failed.');
    } finally {
      // Release the query runner
      await queryRunner.release();
    }
  }

  async addOrder(type: orderType, addOrderDto: AddOrderDto) {
    // console.log(AddOrderDto);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { orderId, orderInfo } = addOrderDto;
      const previousOrder = await this.orderRepository.findOne({
        where: { id: orderId },
      });
      if (!previousOrder) {
        // throw new ForbiddenException('Invalid request');
        return { success: false, msg: 'order not found' };
      }
      previousOrder.remarks = `${previousOrder?.remarks}, ${addOrderDto.remarks}`;
      const orderItems = orderInfo.map((item) => {
        const orderItem = new orderItemEntity();
        orderItem.product = { id: item.product } as productEntity;
        orderItem.quantity = item.quantity;
        orderItem.order = previousOrder;
        orderItem.status =
          type == orderType.receptionist
            ? orderStatus.accepted
            : orderStatus.pending;
        return orderItem;
      });
      const savedOrderItems = await queryRunner.manager.save(orderItems);
      const orderItemAddOns = [];
      savedOrderItems.forEach((orderItem, index) => {
        const addOns = orderInfo[index].addOn?.map((addon) => {
          const addOnEntity = new orderItemAddOnEntity();
          addOnEntity.quantity = addon.quantity;
          addOnEntity.orderItem = orderItem;
          addOnEntity.productAddOn = {
            id: addon.addOnId,
          } as productAddOnEntity;
          return addOnEntity;
        });
        orderItemAddOns.push(...addOns);
      });
      await queryRunner.manager.update(
        orderEntity,
        { id: orderId },
        {
          createdAt: new Date(),
          updatedAt: new Date(),
          status:
            type == orderType.receptionist
              ? orderStatus.accepted
              : orderStatus.pending,
        },
      );
      await queryRunner.manager.save(previousOrder);
      await queryRunner.manager.save(orderItemAddOns);
      await queryRunner.commitTransaction();
      return { success: true, orderId };
    } catch (error) {
      // console.error(error);
      await queryRunner.rollbackTransaction();
      return { success: false, msg: 'unable to add order' };
      // throw new ForbiddenException('add order failed.');
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(id: string, status: orderStatus, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const orders = await this.orderRepository.find({
      where: {
        status,
        session: { table: { restaurant: { id } }, endedAt: IsNull() },
      },
      relations: [
        'session.table',
        'orderItem.product',
        // 'orderItem.orderAddOn.productAddOn',
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        type: true,
        createdAt: true,
        orderItem: {
          id: true,
          status: true,
          product: {
            id: true,
          },
        },
        session: {
          id: true,
          table: {
            id: true,
            name: true,
          },
        },
      },
    });

    const transformedOrders = orders.map((order) => ({
      ...order,
      orderItem: order.orderItem,
      orderItemCount: order.orderItem.length,
      // totalAmount: this.totalBillAmount(order),
    }));

    return {
      orders: transformedOrders,
    };
  }

  async findMyOrder(id: string) {
    const order = await this.findByTable(id);
    // console.log(order);
    if (order) {
      return order;
    } else {
      return { order: [] };
    }
  }

  async findByPhone(phone: number) {
    const order = await this.sessionRepository.findOne({
      where: { phone },
      relations: ['table', 'order'],
    });
    return order;
  }

  async findPhoneByTable(id: string) {
    const session = await this.sessionRepository.findOne({
      where: { endedAt: IsNull(), table: { id } },
      select: {
        id: true,
        phone: true,
      },
    });
    return session ?? null;
  }

  async findByOrderType(id: string, type: orderType) {
    const order = await this.orderRepository.find({
      where: {
        type,
        session: { table: { restaurant: { id } }, endedAt: IsNull() },
      },
      relations: [
        'session.table',
        'orderItem.product',
        'orderItem.orderAddOn.productAddOn',
      ],
      order: {
        createdAt: 'DESC',
      },
      select: {
        id: true,
        type: true,
        session: {
          id: true,
          table: {
            id: true,
            name: true,
          },
        },
        orderItem: {
          id: true,
          status: true,
          quantity: true,
          product: {
            id: true,
            name: true,
            price: true,
            photo: true,
          },
          orderAddOn: {
            id: true,
            quantity: true,
            productAddOn: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    });

    const orders = order.map((order) => ({
      ...order,
      // orderItem:,
      orderItemCount: order.orderItem.length,
      totalAmount: order ? this.totalBillAmount(order) : 0,
    }));

    return {
      orders,
    };
  }

  async findOne(id: string) {
    const order = this.orderRepository.findOne({
      where: { id },
      relations: [
        'session.table',
        'orderItem.product',
        'orderItem.orderAddOn.productAddOn',
      ],
      select: {
        id: true,
        remarks: true,
        status: true,
        session: {
          id: true,
          phone: true,
          table: {
            id: true,
            name: true,
          },
        },
        orderItem: {
          id: true,
          quantity: true,
          status: true,
          product: {
            id: true,
            name: true,
            price: true,
            photo: true,
          },
          orderAddOn: {
            id: true,
            quantity: true,
            productAddOn: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    });
    return order;
  }

  async findByTable(id: string) {
    const order = await this.orderRepository.findOne({
      where: {
        session: {
          table: { id },
          endedAt: IsNull(),
        },
      },
      relations: [
        'session.table',
        'orderItem.product',
        'orderItem.orderAddOn.productAddOn',
      ],
      select: {
        id: true,
        remarks: true,
        status: true,
        session: {
          id: true,
          phone: true,
          endedAt: true,
          table: {
            id: true,
            name: true,
          },
        },
        orderItem: {
          id: true,
          quantity: true,
          status: true,
          createdAt: true,
          product: {
            id: true,
            name: true,
            price: true,
            photo: true,
          },
          orderAddOn: {
            id: true,
            quantity: true,
            productAddOn: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    });
    return order
      ? {
          order,
          orderItemCount: order.orderItem?.length || 0,
          totalAmount: this.totalBillAmount(order),
        }
      : null;
  }

  async findByItemStatus(id: string, status: orderStatus) {
    const order = await this.orderRepository.findOne({
      where: {
        session: {
          table: { id },
          endedAt: IsNull(),
        },
        orderItem: {
          status,
        },
      },
      relations: [
        'session.table',
        'orderItem.product',
        'orderItem.orderAddOn.productAddOn',
      ],
      select: {
        id: true,
        remarks: true,
        status: true,
        session: {
          id: true,
          phone: true,
          endedAt: true,
          table: {
            id: true,
            name: true,
          },
        },
        orderItem: {
          id: true,
          quantity: true,
          status: true,
          product: {
            id: true,
            name: true,
            price: true,
            photo: true,
          },
          orderAddOn: {
            id: true,
            quantity: true,
            createdAt: true,
            productAddOn: {
              id: true,
              name: true,
              price: true,
              createdAt: true,
            },
          },
        },
      },
    });
    return {
      order,
      totalAmount: order ? this.totalBillAmount(order) : 0,
    };
  }

  async addItemQuantity(addOrderQuantity: addOrderQuantity) {
    const { orderItemId, quantity } = addOrderQuantity;
    await this.orderItemRepository.increment(
      { id: orderItemId },
      'quantity',
      quantity,
    );
    return { success: true, msg: `quantity added`, quantity, orderItemId };
  }

  async update(id: string, status: orderStatus) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItem.product'],
    });
    if (status != orderStatus.cancelled) {
      order.orderItem.forEach(async (orderItem) => {
        if (orderItem.status == orderStatus.pending) {
          orderItem.status = status;
          //to update the orderCount
          if (status === orderStatus.accepted) {
            await this.productRepository.increment(
              { id: orderItem.product.id },
              'orderCount',
              orderItem.quantity,
            );
          }
        }
      });
    }
    order.status = status;
    await this.orderRepository.save(order);
    return true;
  }

  async updateOrderItem(id: string, status: orderStatus) {
    await this.orderItemRepository.update({ id }, { status });
    return true;
  }

  async changeTable(id: string, tableId: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['session.table'],
    });
    const table = await this.tableRepository.findOne({
      where: {
        id: tableId,
        status: tableStatus.available,
        session: {
          createdAt: Not(IsNull()),
        },
      },
    });

    if (!table) {
      throw new ForbiddenException('Table unavailable');
    }
    this.sessionRepository.update(
      { id: order.session.id },
      { createdAt: new Date() },
    );
    this.tableRepository.update(
      { id: tableId },
      { status: tableStatus.occupied },
    );
    this.tableRepository.update(
      { id: order.session.table.id },
      { status: tableStatus.available },
    );
    order.session.table = table;
    await this.orderRepository.save(order);
    return true;
  }

  async orderItemDelete(id: string): Promise<boolean> {
    const result = await this.orderItemRepository.delete({
      id,
      status: orderStatus.pending,
    });
    return result.affected > 0 ? true : false;
  }

  async remove(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['session'],
    });
    await this.sessionRepository.delete({ id: order.session.id });
    return true;
  }

  async removeSession(id: string) {
    await this.sessionRepository.delete({ id });
    return true;
  }

  async isTableSession(tableID: string) {
    const session = await this.sessionRepository.findOne({
      where: { table: { id: tableID }, endedAt: IsNull() },
    });
    if (!session) {
      return {
        session: false,
      };
    } else {
      return {
        session: true,
        phone: session.phone,
      };
    }
  }
  async GetphoneByTable(id: string) {
    const order = await this.orderRepository.findOne({
      where: { session: { table: { id }, endedAt: IsNull() } },
      relations: ['session.table'],

      select: {
        session: {
          phone: true,
        },
      },
    });

    return order?.session?.phone || null;
  }

  async findByOrderHistory(userId: string, paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [pagedOrders, total] = await this.orderRepository.findAndCount({
      where: { restaurant: { id: userId }, status: orderStatus.completed },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        status: true,
        type: true,
        createdAt: true,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return { total, pagedOrders };
  }

  totalBillAmount = (order: any) => {
    // console.log(order);
    let totalAmount = 0;

    order?.orderItem?.forEach((item: any) => {
      // console.log(item);
      if (item.status == orderStatus.accepted) {
        const productTotal = item.quantity * item.product.price;
        const addOnTotal = item.orderAddOn.reduce((sum, addOn) => {
          return (
            sum +
            (addOn.productAddOn ? addOn.productAddOn.price * addOn.quantity : 0)
          );
        }, 0);
        const totalItemAmount = productTotal + addOnTotal;
        totalAmount += totalItemAmount;
      }
    });
    return totalAmount;
  };
}
