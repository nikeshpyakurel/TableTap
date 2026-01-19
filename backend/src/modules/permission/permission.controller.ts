import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Req, UseGuards } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/CreateRoleDto.dto';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { UpdateStaffTypeDto } from './dto/UpdateStaffTypeDto';
import { staffTypeEntity } from 'src/model/staffType.entity';

@Controller('permission')
@ApiTags('Permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) { }

  @Post('create-permission')
  createPermission() {
    return this.permissionService.create();
  }

  @Post('create-role-staff')
  @UseGuards(AtGuard)
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_ROLE)
  createRole(
    @Body() createRoleDto: CreateRoleDto,
    @Req() req: any
  ) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.permissionService.createRole(restaurantid, createRoleDto);
    }
    const { user } = req;
    return this.permissionService.createRole(user.sub, createRoleDto);
  }

  @Get()
  @UseGuards(AtGuard)
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_ROLE)
  getPermission() {
    return this.permissionService.getPermission()
  }

  @Get('get-role-staff')
  @UseGuards(AtGuard)
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_ROLE)
  getRoleStaff(@Req() req: any) {
    const { user } = req;
    if (user.role === roleType.staff) {
      return this.permissionService.getRoleStaff(user.rId);
    }
    return this.permissionService.getRoleStaff(user.sub);
  }

  @Get('get-role-staff/:id')
  @UseGuards(AtGuard)
  @Roles(roleType.admin)
  getEachRoleStaff(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.getEachRoleStaff(id);
  }

  @Delete('/delete-role-staff/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_ROLE)
  @UseGuards(AtGuard)
  deleteRole(@Param('id', ParseUUIDPipe) id: string) {
    return this.permissionService.deleteRole(id);
  }

  @Patch('update-role-staff/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_ROLE)
  async updateStaffType(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateStaffTypeDto: UpdateStaffTypeDto,
  ): Promise<staffTypeEntity> {
    return this.permissionService.updateStaffType(id, updateStaffTypeDto);
  }
}
