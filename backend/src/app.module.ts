import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { CategoryModule } from './modules/category/category.module';
import { ProductModule } from './modules/product/product.module';
import databaseConfig from './config/pg.config';
import { SuperAdminModule } from './modules/super-admin/super-admin.module';
import { AuthModule } from './modules/auth/auth.module';
import { StaffModule } from './modules/staff/staff.module';
import { OrderModule } from './modules/order/order.module';
import { TakeawayOrderModule } from './modules/takeaway_order/takeaway_order.module';
import { TableModule } from './modules/table/table.module';
import { LibraryModule } from './modules/library/library.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { BillingModule } from './modules/billing/billing.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { PermissionModule } from './modules/permission/permission.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './exceptions/global.exception';
import { LoggerService } from './logger/logger.service';
import { SeederService } from './seeder/seeder.service';
import { SeederModule } from './seeder/seeder.module';
import { staffPermissionEntity } from './model/staffPermission.entity';
import { hash } from './helper/utils/hash';
import { AdvertisementModule } from './modules/advertisement/advertisement.module';
import { EnquiryModule } from './modules/enquiry/enquiry.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(databaseConfig),
    AuthModule,
    SuperAdminModule,
    RestaurantModule,
    StaffModule,
    CategoryModule,
    ProductModule,
    TableModule,
    OrderModule,
    TakeawayOrderModule,
    SubscriptionModule,
    LibraryModule,
    BillingModule,
    DashboardModule,
    PermissionModule,
    SeederModule,
    AdvertisementModule,
    EnquiryModule
  ],
  controllers: [AppController],
  providers: [
    AppService, LoggerService, GlobalExceptionFilter, SeederService, hash
  ],
})
export class AppModule { }
