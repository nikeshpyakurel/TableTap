import { Module } from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import { AdvertisementController } from './advertisement.controller';
import { UploadService } from 'src/helper/utils/files_upload';
import { TypeOrmModule } from '@nestjs/typeorm';
import { advertisementEntity } from 'src/model/advertisement.entity';

@Module({
  imports:[TypeOrmModule.forFeature([advertisementEntity])],
  controllers: [AdvertisementController],
  providers: [AdvertisementService,UploadService],
})
export class AdvertisementModule {}
