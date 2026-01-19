import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { advertisementEntity } from 'src/model/advertisement.entity';
import {  LessThan, LessThanOrEqual, MoreThan, Not, Repository } from 'typeorm';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';
import { adActiveStatus, adType } from 'src/helper/types/index.type';

@Injectable()
export class AdvertisementService {
  constructor(
    @InjectRepository(advertisementEntity)
    private readonly adRepository: Repository<advertisementEntity>,
  ) {}

  async create(createAdvertisementDto: CreateAdvertisementDto, image: string) {
    const ad = this.adRepository.create({
      ...createAdvertisementDto,
      isActive: adActiveStatus.false,
      image,
    });
    await this.adRepository.save(ad);
    return true;
  }

  async findAllAd(paginationDto: PaginationDto) {
    const { page, pageSize } = paginationDto;
    const [allAd, total] = await this.adRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        title: true,
        image: true,
        adType: true,
        isActive: true,
        startDate: true,
        endDate: true,
      },
    });
    return {
      allAd,
      total,
      totalPage: Math.ceil(total / pageSize),
    };
  }

  async findActiveAd() {
    const activeAd = await this.adRepository.find({
      where: {
        isActive: adActiveStatus.true,
        endDate: LessThan(new Date()),
      },
      select: {
        id: true,
        title: true,
        image: true,
      },
    });
    return activeAd;
  }

  async findAdType(adType:adType){
  const ad=await this.adRepository.findOne({where:{
    isActive:adActiveStatus.true,
    adType
  }});
  return ad;
  }

 
  async updateAdStatus(id: string, status:adActiveStatus) {
    const ad = await this.adRepository.findOne({ where: { id } });

    // const isDateValid=await this.adRepository.find({
    //   where:{
    //     isActive:adActiveStatus.true,
    //     startDate:MoreThan(ad.startDate),
    //     endDate:LessThan(ad.startDate)
    //   }
    // });
    // console.log(isDateValid)

    // if(isDateValid.length>0){
    //   throw new ForbiddenException("Ad is running within this date range.")
    // }

    const runningAd = await this.adRepository.find({
      where: {
        isActive: adActiveStatus.true,
        endDate: MoreThan(ad.startDate),
        adType: ad.adType,
      },
    });

  console.log(runningAd)
    if (runningAd.length > 0) {
      throw new ForbiddenException('Ad is running on this page.');
    } else {
        await this.adRepository.update(
        { adType: ad.adType, isActive: adActiveStatus.true, id: Not(id) },
        { isActive: adActiveStatus.false }
      );
      await this.adRepository.update({ id }, { isActive:status });
    
      return true;
    }
  }
  

  async updateAd(id: string, updateAdvertisementDto: UpdateAdvertisementDto) {
    const ad = await this.adRepository.findOne({ where: { id } });
    const updatedAd = Object.assign(ad, updateAdvertisementDto);
    updatedAd.isActive=adActiveStatus.false;
    await this.adRepository.save(updatedAd);
    return true;
  }

  async updateClickCount(id: string) {
    await this.adRepository.increment({ id }, 'clickCount', 1);
    return true;
  }

  async deleteAd(id: string) {
    await this.adRepository.softDelete({ id });
    return true;
  }
}
