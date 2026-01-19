import { Module } from '@nestjs/common';
import { EnquiryService } from './enquiry.service';
import { EnquiryController } from './enquiry.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { enquiryEntity } from 'src/model/enquiry.entity';

@Module({
  imports:[TypeOrmModule.forFeature([enquiryEntity])],
  controllers: [EnquiryController],
  providers: [EnquiryService],
})
export class EnquiryModule {}
