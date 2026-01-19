import { Module } from '@nestjs/common';
import { TakeawayOrderService } from './takeaway_order.service';
import { TakeawayOrderController } from './takeaway_order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { takeAwayOrderEntity } from 'src/model/takeAwayOrder.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { RestaurantModule } from '../restaurant/restaurant.module';
import { takeAwayOrderItemEntity } from 'src/model/takeAwayOrderItem.entity';
import { takeAwayOrderAddOnEntity } from 'src/model/addOnTakeAwayOrder.entity';

@Module({
  imports: [TypeOrmModule.forFeature([takeAwayOrderEntity, restaurantEntity, takeAwayOrderItemEntity, takeAwayOrderAddOnEntity]), RestaurantModule],
  controllers: [TakeawayOrderController],
  providers: [TakeawayOrderService],
  exports:[TakeawayOrderService,TypeOrmModule]
})
export class TakeawayOrderModule { }
