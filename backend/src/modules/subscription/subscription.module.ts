import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { subscriptionEntity } from 'src/model/subscription.entity';
import { packagePaymentEntity } from 'src/model/packagePayment.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { packageEntity } from 'src/model/package.entity';
import { UploadService } from 'src/helper/utils/files_upload';

@Module({
  imports: [TypeOrmModule.forFeature([subscriptionEntity, packagePaymentEntity, restaurantEntity, packageEntity])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService, UploadService],
})
export class SubscriptionModule { }
