import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantController } from './restaurant.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { hash } from 'src/helper/utils/hash';
import { authEntity } from 'src/model/auth.entity';
import { staffEntity } from 'src/model/staff.entity';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [TypeOrmModule.forFeature([restaurantEntity, authEntity, staffEntity])],
  controllers: [RestaurantController],
  providers: [RestaurantService, hash, UploadService],
  exports: [TypeOrmModule]
})
export class RestaurantModule { }
