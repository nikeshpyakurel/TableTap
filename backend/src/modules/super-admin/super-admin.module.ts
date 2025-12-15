import { Module } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { SuperAdminController } from './super-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { authEntity } from 'src/model/auth.entity';
import { superAdminEntity } from 'src/model/superAdmin.entity';
import { hash } from 'src/helper/utils/hash';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { packageEntity } from 'src/model/package.entity';
import { FaqEntity } from 'src/model/faq.entity';

@Module({
  imports: [TypeOrmModule.forFeature([authEntity, superAdminEntity, restaurantEntity, packageEntity,FaqEntity])],
  controllers: [SuperAdminController],
  providers: [SuperAdminService, hash],
})
export class SuperAdminModule { }
