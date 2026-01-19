import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { staffPermissionEntity } from 'src/model/staffPermission.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateRoleDto } from './dto/CreateRoleDto.dto';
import { staffTypeEntity } from 'src/model/staffType.entity';
import { restaurantEntity } from 'src/model/Restaurant.entity';
import { UpdateStaffTypeDto } from './dto/UpdateStaffTypeDto';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(staffPermissionEntity)
    private readonly permissionRepository: Repository<staffPermissionEntity>,

    @InjectRepository(staffTypeEntity)
    private readonly staffTypeRepository: Repository<staffTypeEntity>,

    @InjectRepository(restaurantEntity)
    private readonly restaurantRepository: Repository<restaurantEntity>,
  ) { }
  async create() {
    const createPermissionDto = [
      { "name": "Create Category" },
      { "name": "View Category" },
      { "name": "Update Category" },
      { "name": "Delete Category" },
      { "name": "Create Product" },
      { "name": "View Product" },
      { "name": "Update Product" },
      { "name": "Delete Product" },
      { "name": "Create Role" },
      { "name": "View Role" },
      { "name": "Update Role" },
      { "name": "Delete Role" },
      { "name": "Create Reception Order" },
      { "name": "View Reception Order" },
      { "name": "Update Reception Order" },
      { "name": "Delete Reception Order" },
      { "name": "Create Takeaway Order" },
      { "name": "View Takeaway Order" },
      { "name": "Update Takeaway Order" },
      { "name": "Delete Takeaway Order" },
      { "name": "Create Table Order" },
      { "name": "View Table Order" },
      { "name": "Update Table Order" },
      { "name": "Delete Table Order" },
      { "name": "Create Table" },
      { "name": "View Table" },
      { "name": "Update Table" },
      { "name": "Delete Table" },
      { "name": "Create Staff" },
      { "name": "View Staff" },
      { "name": "Update Staff" },
      { "name": "Delete Staff" },
      { "name": "View Statistics" }

    ]
    try {
      const permission = await this.permissionRepository.save(createPermissionDto);
      return permission;
    } catch (error) {
      // console.log(error);
      throw new HttpException('Error while creating permission', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteRole(id: string) {
    const staffType = await this.staffTypeRepository.findOne({ where: { id } });
    if (!staffType) {
      throw new NotFoundException('Permission not found');
    }
    return await this.staffTypeRepository.remove(staffType);
  }

  async getPermission() {
    return this.permissionRepository.find()
  }

  async createRole(id, createRoleDto: CreateRoleDto) {
    const existingRestaurant = await this.restaurantRepository.findOne({ where: { id } });
    const permissions = await this.permissionRepository.find({ where: { id: In(createRoleDto.permissionIds) } });
    if (!existingRestaurant) throw new NotFoundException('Restaurant not found');
    const staffType = new staffTypeEntity();
    staffType.restaurant = existingRestaurant;
    staffType.name = createRoleDto.name;
    staffType.permission = permissions;
    return await this.staffTypeRepository.save(staffType);
  }

  async updateStaffType(id: string, updateStaffTypeDto: UpdateStaffTypeDto): Promise<staffTypeEntity> {
    const { name, permissionIds } = updateStaffTypeDto;

    const staffType = await this.staffTypeRepository.findOne({
      where: { id },
      relations: ['restaurant', 'permission'],
    });
    if (!staffType) {
      throw new NotFoundException(`StaffType with ID ${id} not found`);
    }

    if (name) staffType.name = name;

    if (permissionIds) {
      const permissions = await this.permissionRepository.findByIds(permissionIds);
      if (permissions.length !== permissionIds.length) {
        throw new NotFoundException(`Some permissions not found`);
      }
      staffType.permission = permissions;
    }

    return this.staffTypeRepository.save(staffType);
  }

  async getRoleStaff(id) {
    return this.staffTypeRepository.find({ where: { restaurant: { id } } })
  }

  async getEachRoleStaff(id) {
    return this.staffTypeRepository.findOne({ where: { id: id }, relations: ['permission'] })
  }
}