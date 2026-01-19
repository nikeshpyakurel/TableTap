import { ForbiddenException, Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { DataSource, Repository } from 'typeorm';
import { authEntity } from 'src/model/auth.entity';
import { staffEntity } from 'src/model/staff.entity';
import { hash } from 'src/helper/utils/hash';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { roleType } from 'src/helper/types/index.type';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@Injectable()
export class RestaurantService {

  constructor(
    @InjectRepository(restaurantEntity)
    private readonly restaurantRepository: Repository<restaurantEntity>,

    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,

    @InjectRepository(staffEntity)
    private readonly staffRepository: Repository<staffEntity>,

    private hash: hash,
    private dataSource: DataSource
  ) { }

  async createStaff(id: string, createAuthDto: CreateAuthDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { email, password } = createAuthDto;
      const hashedPassword = await this.hash.value(password);
      const auth = new authEntity();
      auth.email = email;
      (auth.password = hashedPassword), (auth.role = roleType.staff);
      await queryRunner.manager.save(auth);

      const staff = new staffEntity();
      staff.name = '';
      staff.address = '';
      staff.email = email;
      staff.auth = auth;
      staff.restaurant = { id } as restaurantEntity;
      await queryRunner.manager.save(staff);
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      // console.log(error);
      await queryRunner.rollbackTransaction();
      throw new ForbiddenException(error.errorResponse);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(paginationDto?: PaginationDto) {
    const { page, pageSize } = paginationDto;
    if (page && pageSize) {
      const [pagedRestaurant, total] = await this.restaurantRepository.findAndCount({
        skip: (page - 1) * pageSize,
        take: pageSize
      });
      return { total, pagedRestaurant };
    } else {
      return await this.restaurantRepository.find();
    }
  }

  async findOne(id: string) {
    const res = await this.restaurantRepository.findOne({ where: { id } });
    if (!res) {
      throw new ForbiddenException('invalid restaurant id')
    }
    return res;
  }


  async update(id: string, updateRestaurantDto: UpdateRestaurantDto) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    const updatedRestaurant = Object.assign(restaurant, updateRestaurantDto);
    await this.restaurantRepository.save(updatedRestaurant);
    return true
  }


  async updatePhoto(id: string, photo: string) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    restaurant.photo = photo;
    await this.restaurantRepository.save(restaurant);
    return true
  }

  async updateCoverPhoto(id: string, photo: string) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    restaurant.coverImage = photo;
    await this.restaurantRepository.save(restaurant);
    return true
  }

  async remove(id: string) {
    const restaurant = await this.restaurantRepository.findOne({ where: { id } });
    await this.restaurantRepository.remove(restaurant);
    return true
  }

}
