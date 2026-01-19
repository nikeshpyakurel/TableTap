import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryEntity } from 'src/model/Category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadService } from 'src/helper/utils/files_upload';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { subscriptionEntity } from 'src/model/subscription.entity';


@Module({
  imports: [TypeOrmModule.forFeature([categoryEntity, restaurantEntity, subscriptionEntity])],
  controllers: [CategoryController],
  providers: [CategoryService, UploadService],
})
export class CategoryModule { }
