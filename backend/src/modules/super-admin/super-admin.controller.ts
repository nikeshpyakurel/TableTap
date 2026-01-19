import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { SuperAdminService } from './super-admin.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { CreateRestaurant, updateRestaurant } from './dto/restaurant.dto';
import { packageEntity } from 'src/model/package.entity';
import { CreatePackageDto, UpdatePackageDto } from './dto/pacakge.dto';
import { UUID } from 'crypto';
import { CreateSuperAdminDto } from './dto/create-super-admin.dto';
import { CreateFAQDto } from './dto/faq.dto';
import { UpdateFaqDto } from './dto/update-super-admin.dto';

@Controller('super-admin')
@ApiTags('Super Admin')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class SuperAdminController {
  constructor(private readonly superAdminService: SuperAdminService) { }

  // Add Super Admin
  @Post('account')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a superAdmin Account' })
  createSuperAdmin(@Body() createAuthDto: CreateSuperAdminDto) {
    return this.superAdminService.createSuperAdmin(createAuthDto);
  }

  // Delete Super Admin
  @Delete('delete-super-admin/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete superAdmin account' })
  deleteSuperAdmin(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.superAdminService.deleteSuperAdmin(id);
  }

  // Add Restaurant
  @Post('restaurant-account')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create restaurant account' })
  createRestaurant(@Body() createAuthDto: CreateRestaurant) {
    return this.superAdminService.createRestaurant(createAuthDto);
  }

  @Post('add-faq')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create restaurant account' })
  createFAQ(@Body() CreateFAQDto: CreateFAQDto) {
    return this.superAdminService.createFAQ(CreateFAQDto);
  }

  @Get('restaurant-account')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get all restaurant account' })
  findAllRestaurant() {
    return this.superAdminService.findAllRestaurant();
  }

  @Get('all-faq')
  @ApiOperation({ summary: 'Get all faq' })
  getFaq() {
    return this.superAdminService.getFaq();
  }

  @Get('get-faq/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete pacakge' })
  async getOneFaq(@Param('id', ParseUUIDPipe) id: UUID){
    return this.superAdminService.getOneFaq(id);
  }
  
  // Update Restaurant Status
  @Patch('restaurant-account')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update restaurant status' })
  updateRestaurantStatus(@Body() data: updateRestaurant) {
    return this.superAdminService.updateRestaurantStatus(data);
  }

  // Delete Restaurant
  @Delete('delete-restaurant/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete restaurant account' })
  deleteRestaurant(@Param('id', ParseUUIDPipe) id: UUID) {
    return this.superAdminService.deleteRestaurant(id);
  }

  // Create a new package
  @Post('create-package')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create pacakge' })
  async createPackage(@Body() createPackageDto: CreatePackageDto) {
    return this.superAdminService.createPackage(createPackageDto);
  }

  // Get all pacakges
  @Get('get-packages')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all pacakges' })
  async findAll(): Promise<packageEntity[]> {
    return this.superAdminService.findAllPackage();
  }

  // Get all pacakges by id
  @Get('get-packages/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all pacakges' })
  async findAllById(@Param('id', ParseUUIDPipe) id: UUID): Promise<packageEntity> {
    return this.superAdminService.findAllPackageById(id);
  }

  // Update pacakge
  @Patch('update-packages/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update pacakge' })
  async update(
    @Param('id',ParseUUIDPipe) id: string,
    @Body() updatePackageDto: UpdatePackageDto,
  ) {
    return this.superAdminService.updatePackage(id, updatePackageDto);
  }

  @Patch('update-faq/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create restaurant account' })
  updateFAQ(@Param('id',ParseUUIDPipe) id: string,@Body() UpdateFaqDto: UpdateFaqDto) {
    return this.superAdminService.updateFAQ(id,UpdateFaqDto);
  }

  // Delete pacakge
  @Delete('delete-packages/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete pacakge' })
  async delete(@Param('id', ParseUUIDPipe) id: UUID): Promise<packageEntity> {
    return this.superAdminService.deletePackage(id);
  }

  @Delete('delete-faq/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete pacakge' })
  async deleteFaq(@Param('id', ParseUUIDPipe) id: UUID){
    return this.superAdminService.deleteFaq(id);
  }

} 