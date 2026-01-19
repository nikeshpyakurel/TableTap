import { Module } from '@nestjs/common';
import { StaffService } from './staff.service';
import { StaffController } from './staff.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { staffEntity } from 'src/model/staff.entity';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { UploadService } from 'src/helper/utils/files_upload';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { staffPermissionEntity } from 'src/model/staffPermission.entity';
import { staffTypeEntity } from 'src/model/staffType.entity';
import { authEntity } from 'src/model/auth.entity';
import { hash } from 'src/helper/utils/hash';

@Module({
  imports: [TypeOrmModule.forFeature([staffEntity, restaurantEntity, staffPermissionEntity, staffTypeEntity, authEntity])],
  controllers: [StaffController],
  providers: [StaffService, AtStrategy, UploadService, hash],
})
export class StaffModule { }
