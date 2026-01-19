import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { staffEntity } from 'src/model/staff.entity';
import { Repository } from 'typeorm';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { CreateStaffTypeDto } from './dto/create-staff-type.dto';
import { staffTypeEntity } from 'src/model/staffType.entity';
import { staffPermissionEntity } from 'src/model/staffPermission.entity';
import { authEntity } from 'src/model/auth.entity';
import { hash } from 'src/helper/utils/hash';
import { roleType } from 'src/helper/types/index.type';

@Injectable()
export class StaffService {
  constructor(
    @InjectRepository(staffEntity)
    private readonly staffRepository: Repository<staffEntity>,

    @InjectRepository(restaurantEntity)
    private readonly restaurantRepository: Repository<restaurantEntity>,

    @InjectRepository(staffTypeEntity)
    private readonly staffTypeRepository: Repository<staffTypeEntity>,

    @InjectRepository(staffPermissionEntity)
    private readonly permissionRepository: Repository<staffPermissionEntity>,

    @InjectRepository(authEntity)
    private readonly authRepository: Repository<authEntity>,

    private hashPassword: hash,
  ) { }

  async createStaffType(createStaffTypeDto: CreateStaffTypeDto): Promise<staffTypeEntity> {
    const { name, permissionIds, restaurantId } = createStaffTypeDto;

    const staffType = new staffTypeEntity();
    staffType.name = name;
    if (restaurantId) {
      const restaurant = await this.restaurantRepository.findOneBy({ id: restaurantId });
      if (!restaurant) throw new NotFoundException('Restaurant not found');
      staffType.restaurant = restaurant;
    }

    if (permissionIds && permissionIds.length > 0) {
      const permissions = await this.permissionRepository.findByIds(permissionIds);
      staffType.permission = permissions;
    }

    return this.staffTypeRepository.save(staffType);
  }

  async deleteStaff(id: string) {
    const staffType = await this.staffRepository.findOneBy({ id });
    if (!staffType) throw new NotFoundException('Staff type not found');
    return await this.staffRepository.remove(staffType);
  }

  async updateStaffType(id: string, updateStaffTypeDto: CreateStaffTypeDto) {
    const staffType = await this.staffTypeRepository.findOneBy({ id });
    if (!staffType) throw new NotFoundException('Staff type not found');

    const updatedStaffType = Object.assign(staffType, updateStaffTypeDto);
    return await this.staffTypeRepository.save(updatedStaffType);
  }

  async findAllStaffType(id: string, paginationDto?: PaginationDto) {
    return this.staffRepository.find({ where: { restaurant: { id } }, relations: ['staffType'] })
  }

  //  ===============================================================

  async createStaff(createStaffDto: CreateStaffDto, restaurantid: string) {
    try {
      const { name, staffTypeId, phone, email, password, address } = createStaffDto;
      const existingEmail = await this.staffRepository.findOne({ where: { email } });
      const existingPhone = await this.staffRepository.findOne({ where: { phone } });

      if (existingEmail) {
        throw new BadRequestException(`Email ${email} already exists`);
      }
      if (existingPhone) {
        throw new BadRequestException(`Phone ${phone} already exists`);
      }


      const staffType = await this.staffTypeRepository.findOne({ where: { id: staffTypeId } });
      const restaurant = await this.restaurantRepository.findOneBy({ id: restaurantid });
      if (!restaurant || !staffType) throw new NotFoundException('Staff type or restaurant not found');

      const staff = new staffEntity();
      staff.name = name;
      staff.photo = '';
      staff.phone = Number(phone);
      staff.email = email;
      staff.address = address;
      staff.restaurant = restaurant;
      staff.staffType = staffType;

      // Save the staff first
      await this.staffRepository.save(staff);

      // Then create and save the auth entity
      const auth = new authEntity();
      auth.email = email;
      auth.password = await this.hashPassword.value(password);
      auth.staff = staff;
      auth.role = roleType.staff;
      await this.authRepository.save(auth);

      return staff;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, updateStaffDto: UpdateStaffDto) {
    const staff = await this.staffRepository.findOne({ where: { id } });
    const updatedStaff = Object.assign(staff, updateStaffDto);
    return await this.staffRepository.save(updatedStaff);
  }

  async updatePhoto(id: string, photo: string) {
    const staff = await this.staffRepository.findOne({ where: { id } });
    staff.photo = photo;
    return await this.staffRepository.save(staff);
  }

  async remove(restaurantid: string, id: string) {
    const staff = await this.staffRepository.findOne({ where: { restaurant: { id: restaurantid }, id } });
    return await this.staffRepository.remove(staff);
  }

  async updateStaffInfo(id: string, updateStaffTypeDto: UpdateStaffDto, restaurantid: string) {
    const staff = await this.staffRepository.findOne({ where: { id } });
    const updatedStaff = Object.assign(staff, updateStaffTypeDto);
    updatedStaff.restaurant = await this.restaurantRepository.findOneBy({ id: restaurantid });
    return await this.staffRepository.save(updatedStaff);
  }
}