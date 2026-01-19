import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { UploadService } from 'src/helper/utils/files_upload';
import { TypeOrmModule } from '@nestjs/typeorm';
import { productEntity } from 'src/model/Product.entity';
import { categoryEntity } from 'src/model/Category.entity';
import { CategoryModule } from '../category/category.module';
import { productAddOnEntity } from 'src/model/Product_Addon.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { subscriptionEntity } from 'src/model/subscription.entity';

@Module({
  imports: [TypeOrmModule.forFeature([productEntity, categoryEntity, productAddOnEntity, restaurantEntity, subscriptionEntity]), CategoryModule],
  controllers: [ProductController],
  providers: [ProductService, UploadService],
  exports: [ProductService, TypeOrmModule],
})
export class ProductModule { }
