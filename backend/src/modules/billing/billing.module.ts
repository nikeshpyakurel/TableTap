import { Module } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { orderEntity } from 'src/model/order.entity';
import { billingEntity } from 'src/model/billing.entity';
import { billPaymentEntity } from 'src/model/billPayment.entity';
import { sessionEntity } from 'src/model/session.entity';
import { tableEntity } from 'src/model/table.entity';
import { OrderService } from '../order/order.service';
import { orderItemEntity } from 'src/model/orderItem.entity';
import { productEntity } from 'src/model/Product.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      orderEntity,
      orderItemEntity,
      billingEntity,
      billPaymentEntity,
      sessionEntity,
      tableEntity,
      productEntity
    ]),
  ],
  controllers: [BillingController],
  providers: [BillingService, OrderService],
})
export class BillingModule { }
