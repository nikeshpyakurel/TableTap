import { Injectable } from '@nestjs/common';
import { CreateTakeawayOrderDto } from './dto/create-takeaway_order.dto';
import { UpdateTakeawayOrderDto } from './dto/update-takeaway_order.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { takeAwayOrderEntity } from 'src/model/takeAwayOrder.entity';
import { DataSource, Repository } from 'typeorm';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { takeAwayOrderItemEntity } from 'src/model/takeAwayOrderItem.entity';
import { takeAwayOrderAddOnEntity } from 'src/model/addOnTakeAwayOrder.entity';
import { productAddOnEntity } from 'src/model/Product_Addon.entity';
import { productEntity } from 'src/model/Product.entity';
import { orderStatus } from 'src/helper/types/index.type';

@Injectable()
export class TakeawayOrderService {
  constructor(
    @InjectRepository(takeAwayOrderEntity)
    private readonly takeAwayOrderRepository: Repository<takeAwayOrderEntity>,
    @InjectRepository(restaurantEntity)
    private readonly restaurantRepository: Repository<restaurantEntity>,
    @InjectRepository(takeAwayOrderItemEntity)
    private readonly takeAwayOrderItemRepo: Repository<takeAwayOrderItemEntity>,
    @InjectRepository(takeAwayOrderAddOnEntity)
    private readonly takeAwayAddonRepo: Repository<takeAwayOrderAddOnEntity>,
    private dataSource: DataSource,
  ) { }
  async create(id: string, createTakeawayOrderDto: CreateTakeawayOrderDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const { customerName, phone, orderItems, discount } =
        createTakeawayOrderDto;
      // Find the restaurant
      const restaurant = await this.restaurantRepository.findOne({
        where: { id },
      });
      if (!restaurant) {
        throw new Error('Restaurant not found');
      }

      // Create and save the takeaway order
      const takeaway = new takeAwayOrderEntity();
      takeaway.customerName = customerName;
      takeaway.phone = phone;
      takeaway.discount = discount ? discount : 0;
      takeaway.restaurant = restaurant;
      await queryRunner.manager.save(takeaway);

      // Create and save the takeaway order items
      const savedItems = [];
      for (const itemDto of orderItems) {
        const takeAwayItem = new takeAwayOrderItemEntity();
        takeAwayItem.takeAwayOrder = takeaway;
        takeAwayItem.price = itemDto.price;
        takeAwayItem.quantity = itemDto.quantity;
        const product = await queryRunner.manager.findOne(productEntity, {
          where: { id: itemDto.productId },
        });
        takeAwayItem.product = product;
        const savedItem = await queryRunner.manager.save(takeAwayItem);
        savedItems.push(savedItem);
      }

      // Create and save takeaway order item add-ons
      const takeawayAddOns = [];
      for (const [index, item] of savedItems.entries()) {
        if (orderItems[index].addOn) {
          for (const addon of orderItems[index].addOn) {
            const productAddOn = await queryRunner.manager.findOne(
              productAddOnEntity,
              { where: { id: addon.addOnId } },
            );

            const addOnEntity = new takeAwayOrderAddOnEntity();
            addOnEntity.takeAwayOrderItem = item;
            addOnEntity.productAddOn = productAddOn;
            takeawayAddOns.push(addOnEntity);
          }
        }
      }

      // Save all add-ons
      await queryRunner.manager.save(takeawayAddOns);

      // Commit the transaction
      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      // console.error(error);
      await queryRunner.rollbackTransaction();
      return { success: false, msg: 'Unable to add order' };
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(id: string) {
    const takeaway_order = await this.takeAwayOrderRepository.find({
      where: { restaurant: { id } },
      relations: [
        'takeAwayOrderItems',
        'takeAwayOrderItems.product',
        'takeAwayOrderItems.takeAwayOrderAddOn',
        'takeAwayOrderItems.takeAwayOrderAddOn.productAddOn',
      ],
      order: {
        createdAt: 'DESC'
      },
    });
    return takeaway_order;
  }

  async findOne(id: string) {
    return await this.takeAwayOrderRepository.findOne({
      where: { id },
      relations: [
        'takeAwayOrderItems',
        'takeAwayOrderItems.product',
        'takeAwayOrderItems.takeAwayOrderAddOn',
        'takeAwayOrderItems.takeAwayOrderAddOn.productAddOn',
      ],
    });
  }

  async updateOrderWithItemsAndAddons(
    id: string,
    updateTakeawayOrderDto: UpdateTakeawayOrderDto,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Update the takeaway order
      const takeawayOrder = await this.takeAwayOrderRepository.findOne({
        where: { id },
      });
      if (!takeawayOrder) {
        throw new Error('Takeaway order not found');
      }

      Object.assign(takeawayOrder, updateTakeawayOrderDto);
      await queryRunner.manager.save(takeawayOrder);

      // Update the takeaway order items
      if (
        updateTakeawayOrderDto.orderItems &&
        updateTakeawayOrderDto.orderItems.length > 0
      ) {
        for (const itemDto of updateTakeawayOrderDto.orderItems) {
          const takeawayOrderItem = await this.takeAwayOrderItemRepo.findOne({
            where: { id: itemDto.id },
          });
          if (!takeawayOrderItem) {
            throw new Error(`Order item with id ${itemDto.id} not found`);
          }
          const product = await queryRunner.manager.findOne(productEntity, {
            where: { id: itemDto.productId },
          });
          // Update order item
          takeawayOrderItem.product = product;
          takeawayOrderItem.quantity = itemDto.quantity;
          takeawayOrderItem.price = itemDto.price;
          await queryRunner.manager.save(takeawayOrderItem);

          // Update the add-ons for the order item if provided
          if (itemDto.addOn && itemDto.addOn.length > 0) {
            for (const addOnDto of itemDto.addOn) {
              const takeAwayAddOn = await this.takeAwayAddonRepo.findOne({
                where: { id: addOnDto.id },
              });
              if (!takeAwayAddOn) {
                throw new Error(`Add-on with id ${addOnDto.addOnId} not found`);
              }

              takeAwayAddOn.productAddOn.id = addOnDto.addOnId;
              takeAwayAddOn.takeAwayOrderItem = takeawayOrderItem;
              await queryRunner.manager.save(takeAwayAddOn);
            }
          }
        }
      }

      // Commit the transaction
      await queryRunner.commitTransaction();
      return { success: true };
    } catch (error) {
      // console.error(error);
      await queryRunner.rollbackTransaction();
      return { success: false, message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  async updateOrder(id: string, status: orderStatus) {
    await this.takeAwayOrderRepository.update({ id }, { status });
    return true;
  }

  async remove(id: string) {
    const order = await this.takeAwayOrderRepository.findOne({ where: { id } });
    return await this.takeAwayOrderRepository.remove(order);
  }
}
