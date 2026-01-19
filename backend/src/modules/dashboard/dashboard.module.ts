import { Module } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { OrderService } from '../order/order.service';
import { TakeawayOrderModule } from '../takeaway_order/takeaway_order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { categoryEntity } from 'src/model/Category.entity';
import { tableEntity } from 'src/model/table.entity';


@Module({
  imports: [TypeOrmModule.forFeature([categoryEntity, tableEntity]), OrderModule, ProductModule, TakeawayOrderModule],
  controllers: [DashboardController],
  providers: [DashboardService, OrderService],
})
export class DashboardModule { }
