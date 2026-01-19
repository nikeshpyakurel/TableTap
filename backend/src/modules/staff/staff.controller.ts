import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, UseInterceptors, FileTypeValidator, ParseFilePipe, UploadedFile, Query, ParseUUIDPipe } from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { UpdatePhotoDto } from './dto/photoUpdate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { CreateStaffTypeDto } from './dto/create-staff-type.dto';
import { staffTypeEntity } from 'src/model/staffType.entity';

@Controller('staff')
@ApiTags('Staff')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class StaffController {
  constructor(
    private readonly staffService: StaffService,
    private readonly uploadService: UploadService
  ) { }


  // Staff type
  @Post("create-staff-type")
  @Roles(roleType.admin, roleType.staff)
  // @Permissions(PermissionType.CREATE_STAFFTYPE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create staff type' })
  create(@Body() createStaffTypeDto: CreateStaffTypeDto): Promise<staffTypeEntity> {
    return this.staffService.createStaffType(createStaffTypeDto);
  }

  // @Delete(':id')
  // @Roles(roleType.admin, roleType.staff)
  // @Permissions(PermissionType.DELETE_STAFFTYPE)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'delete staff type' })
  // remove(@Param('id', ParseUUIDPipe) id: string) {
  //   return this.staffService.deleteStaff(id);
  // }

  @Patch('update-staff-type/:id')
  @Roles(roleType.admin, roleType.staff)
  // @Permissions(PermissionType.UPDATE_STAFFTYPE)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update staff type' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStaffTypeDto: CreateStaffTypeDto) {
    return this.staffService.updateStaffType(id, updateStaffTypeDto);
  }

  @Get()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_STAFF)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all staff types' })
  findAll(@Req() req: any, @Query() paginationDto?: PaginationDto) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.staffService.findAllStaffType(restaurantid, paginationDto);
    }
    const id = req.user.sub;
    return this.staffService.findAllStaffType(id, paginationDto);
  }

  // Staff
  @Post("create-staff")
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_STAFF)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create staff' })
  createStaff(@Req() req: any, @Body() createStaffDto: CreateStaffDto) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.staffService.createStaff(createStaffDto, restaurantid);
    }
    const restaurantid = req.user.sub;
    return this.staffService.createStaff(createStaffDto, restaurantid);
  }

  @Patch('update-info')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_STAFF)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update staff info' })
  updateStaff(@Req() req: any, @Body() updateStaffDto: UpdateStaffDto) {
    if (req.user.role === roleType.staff) {
      const id = req.user.rId;
      console.log(id);
      return this.staffService.update(id, updateStaffDto);
    }
    const id = req.user.sub;
    return this.staffService.update(id, updateStaffDto);
  }

  @Patch('update-photo/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_STAFF)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update staff photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePhotoDto })
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(@Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    // const s3response = await this.uploadService.upload(
    //   file.originalname,
    //   file.buffer,
    // );
    const s3response = await this.uploadService.upload(file);
    if (req.user.role === roleType.staff) {
      const id = req.user.rId;
      return this.staffService.updatePhoto(id, s3response);
    }
    const id = req.user.sub;
    return this.staffService.updatePhoto(id, s3response);
  }

  @Delete(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_STAFF)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete staff' })
  removeStaff(@Req() req: any, @Param('id') id: string) {

    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;

      return this.staffService.remove(restaurantid, id);
    }
    const restaurantid = req.user.sub;
    return this.staffService.remove(restaurantid, id);
  }

  @Patch('update-staff-info/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_STAFF)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update staff type' })
  updateStaffType(@Req() req: any, @Param('id', ParseUUIDPipe) id: string, @Body() updateStaffTypeDto: UpdateStaffDto) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.staffService.updateStaffInfo(id, updateStaffTypeDto, restaurantid);
    }
    const restaurantid = req.user.sub;
    return this.staffService.updateStaffInfo(id, updateStaffTypeDto, restaurantid);
  }
}
