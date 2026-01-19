import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { orderEntity } from 'src/model/order.entity';
import { OrderGateway } from './order.gateway';
import { sessionEntity } from 'src/model/session.entity';
import { orderItemEntity } from 'src/model/orderItem.entity';
import { billingEntity } from 'src/model/billing.entity';
import { tableEntity } from 'src/model/table.entity';
import { productEntity } from 'src/model/Product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      orderEntity,
      sessionEntity,
      orderItemEntity,
      billingEntity,
      tableEntity,
      productEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderGateway],
  exports: [OrderService, TypeOrmModule],
})
export class OrderModule {}
