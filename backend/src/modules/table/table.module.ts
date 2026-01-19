import { Module } from '@nestjs/common';
import { TableService } from './table.service';
import { TableController } from './table.controller';
import { tableEntity } from 'src/model/table.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { subscriptionEntity } from 'src/model/subscription.entity';


@Module({
  imports: [TypeOrmModule.forFeature([tableEntity, restaurantEntity, subscriptionEntity])],
  controllers: [TableController],
  providers: [TableService],
})
export class TableModule { }
