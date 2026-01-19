import { Module } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { staffPermissionEntity } from 'src/model/staffPermission.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { staffTypeEntity } from 'src/model/staffType.entity';

@Module({
  imports: [TypeOrmModule.forFeature([staffPermissionEntity, restaurantEntity, staffTypeEntity])],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [TypeOrmModule]
})
export class PermissionModule { }
