import { Injectable } from '@nestjs/common';
import { CreateEnquiryDto } from './dto/create-enquiry.dto';
import { UpdateEnquiryDto } from './dto/update-enquiry.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { enquiryEntity } from 'src/model/enquiry.entity';
import { Repository } from 'typeorm';
import { leadStatus } from 'src/helper/types/index.type';
import { sendEnquiryMail } from 'src/helper/utils/email_template';

@Injectable()
export class EnquiryService {
  constructor(
    @InjectRepository(enquiryEntity)
    private readonly enquiryRepository:Repository<enquiryEntity>
  ){}
 async create(createEnquiryDto: CreateEnquiryDto) {
    const enquiry=this.enquiryRepository.create({
      ...createEnquiryDto,
    });
    await this.enquiryRepository.save(enquiry);
    sendEnquiryMail(createEnquiryDto);
    return true;
  }

 async findAll(leadStatus:leadStatus) {
  const leads=await this.enquiryRepository.find({
    where:{leadStatus},
    order:{
      updatedAt:'DESC'
    }
  })
    return leads;
  }

  async updateStatus(id:string,leadStatus:leadStatus){
  await this.enquiryRepository.update({id},{leadStatus});
  return true;
  }



  async remove(id: string) {
    await this.enquiryRepository.softDelete({id});
    return true;
  }
}
