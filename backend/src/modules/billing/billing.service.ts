import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateBillingDto } from './dto/create-billing.dto';
import { UpdateBillingDto } from './dto/update-billing.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { billingEntity } from 'src/model/billing.entity';
import { DataSource, Repository } from 'typeorm';
import { orderEntity } from 'src/model/order.entity';
import { takeAwayOrderEntity } from 'src/model/takeAwayOrder.entity';
import {
  billingStatus,
  orderStatus,
  paymentMethod,
  tableStatus,
} from 'src/helper/types/index.type';
import { billPaymentEntity } from 'src/model/billPayment.entity';
import { sessionEntity } from 'src/model/session.entity';
import { tableEntity } from 'src/model/table.entity';
import { OrderService } from '../order/order.service';

@Injectable()
export class BillingService {
  constructor(
    @InjectRepository(tableEntity)
    private readonly tableRepository: Repository<tableEntity>,

    @InjectRepository(billingEntity)
    private readonly billingRepository: Repository<billingEntity>,

    @InjectRepository(orderEntity)
    private readonly orderRepository: Repository<orderEntity>,

    @InjectRepository(billPaymentEntity)
    private readonly billPaymentRepository: Repository<billPaymentEntity>,

    @InjectRepository(sessionEntity)
    private readonly sessionRepository: Repository<sessionEntity>,

    private readonly dataSource: DataSource,

    private readonly orderService: OrderService,
  ) {}
  async create(method: paymentMethod, createBillingDto: CreateBillingDto) {
    const { orderId, takeAwayOrderId, tableId, discount, amount, remarks } =
      createBillingDto;
    const bill = await this.billInfo(createBillingDto.orderId);
    const billing = await this.billingRepository.findOne({
      where: { order: { id: orderId } },
    });
    if (billing.totalPaidAmount + amount > bill.totalAmount) {
      return {
        msg: 'please provide equivalent amount',
        remaing: bill.totalAmount - billing.totalPaidAmount,
      };
    }
    let totalPaid = 0;
    if (bill.totalAmount == amount + (discount ? discount : 0)) {
      billing.totalPaidAmount = amount;
      billing.discount = discount ? discount : 0;
      billing.status = billingStatus.paid;
      await this.orderRepository.update(
        { id: orderId },
        { status: orderStatus.completed },
      );
      await this.tableRepository.update(
        { id: tableId },
        { status: tableStatus.available },
      );
      this.sessionEnd(orderId);
    } else {
      const billPayment = this.billPaymentRepository.create({
        billing,
        amount,
        method,
        remarks,
      });
      await this.billPaymentRepository.save(billPayment);
      const billPayments = await this.billPaymentRepository.find({
        where: { billing: { id: billing.id } },
      });
      billPayments.map((payment) => {
        totalPaid += payment.amount;
      });
      billing.totalPaidAmount = totalPaid;
      if (totalPaid + (discount ? discount : 0) == bill.totalAmount) {
        billing.status = billingStatus.paid;
        await this.orderRepository.update(
          { id: orderId },
          { status: orderStatus.completed },
        );
        await this.tableRepository.update(
          { id: tableId },
          { status: tableStatus.available },
        );
        this.sessionEnd(orderId);
      } else {
        billing.discount = discount ? discount : 0;
        billing.status = billingStatus.partiallyPaid;
      }
    }
    billing.updatedAt = new Date();
    await this.billingRepository.save(billing);
    return bill.totalAmount == totalPaid
      ? { success: true, msg: 'Payment completed' }
      : { success: true, remainingAmount: bill.totalAmount - totalPaid };
  }

  async billSettle(id: string, tableId: string) {
    const billing = await this.billingRepository.findOne({
      where: { order: { id } },
      relations: [
        'order.orderItem.product',
        'order.orderItem.orderAddOn.productAddOn',
      ],
    });
    billing.totalPaidAmount = this.orderService.totalBillAmount(billing.order);
    billing.status = billingStatus.paid;
    await this.orderRepository.update(
      { id },
      { status: orderStatus.completed },
    );
    await this.tableRepository.update(
      { id: tableId },
      { status: tableStatus.available },
    );
    this.sessionEnd(id);
    await this.billingRepository.save(billing);
    return true;
  }

  async billSettleQuickOrder(
    id: string,
    restroId: string,
    createBillingDto: CreateBillingDto,
  ) {
    const { discount, amount, remarks } = createBillingDto;
    const bill = this.billingRepository.create({
      takeAwayOrder: { id },
      totalPaidAmount: amount,
      discount,
      status: billingStatus.paid,
      restaurant: { id: restroId },
    });
    await this.billingRepository.save(bill);
    return true;
  }

  async findAll(id: string, status: billingStatus) {
    const billing = await this.billingRepository.find({
      where: {
        ...(status && { status }),
        restaurant: { id },
      },
    });
    return billing;
  }

  async findOne(id: string) {
    const billing = await this.billingRepository.findOne({
      where: { id },
      relations: ['payment'],
    });
    return billing;
  }

  update(id: number, updateBillingDto: UpdateBillingDto) {
    return `This action updates a #${id} billing`;
  }

  async remove(id: string) {
    await this.billingRepository.delete(id);
    return true;
  }

  async billInfo(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: ['orderItem.product', 'orderItem.orderAddOn.productAddOn'],
      select: {
        id: true,
        createdAt: true,
        orderItem: {
          id: true,
          quantity: true,
          product: {
            id: true,
            name: true,
            price: true,
            discount: true,
          },
          orderAddOn: {
            id: true,
            productAddOn: {
              id: true,
              name: true,
              price: true,
            },
          },
        },
      },
    });

    let totalAmount = 0;
    order.orderItem.forEach((item) => {
      const productTotal = item.quantity * item.product.price;
      const addOnTotal = item.orderAddOn.reduce((sum, addOn) => {
        return sum + addOn.productAddOn.price * addOn.quantity;
      }, 0);
      const totalItemAmount = productTotal + addOnTotal;
      totalAmount += totalItemAmount;
    });
    return {
      ...order,
      totalAmount,
    };
  }

  async sessionEnd(id: string) {
    const session = await this.sessionRepository.findOne({
      where: { order: { id } },
    });
    session.endedAt = new Date();
    await this.sessionRepository.save(session);
  }
}
