import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, FileTypeValidator, ParseFilePipe, UploadedFile, UseInterceptors, Query } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { roleType } from 'src/helper/types/index.type';
import { PhotoUpdateDto } from './dto/photoUpdate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';

@ApiTags('Restaurant')
@Controller('restaurant')
@ApiTags('Restaurent')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class RestaurantController {
  constructor(
    private readonly restaurantService: RestaurantService,
    private readonly uploadService: UploadService,
  ) { }


  @Post('create-staff')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create staff' })
  createStaff(@Req() req: any, @Body() createAuthDto: CreateAuthDto) {
    const adminId = req.user.sub;
    return this.restaurantService.createStaff(adminId, createAuthDto);
  }

  @Get('all')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all restaurants' })
  findAll(@Query() paginationDto?: PaginationDto) {
    return this.restaurantService.findAll(paginationDto);
  }

  @Get("getinfo/:id")
  @ApiOperation({ summary: 'get resturant info' })
  findOne(@Param('id') id: string) {
    return this.restaurantService.findOne(id);
  }


  @Patch('update-info')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update info' })
  @ApiBody({ type: UpdateRestaurantDto })
  updateTheme(@Req() req: any, @Body() updateRestaurantDto: UpdateRestaurantDto) {
    const id = req.user.sub;
    return this.restaurantService.update(id, updateRestaurantDto);
  }


  @Patch('upload-logo')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'upload logo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PhotoUpdateDto })
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(
    @Req() req: any,
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
    const s3response = await this.uploadService.upload(file)
    const id = req.user.sub;

    return this.restaurantService.updatePhoto(id, s3response);
  }

  @Patch('cover-photo')
  @Roles(roleType.admin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'upload cover photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PhotoUpdateDto })
  @UseInterceptors(FileInterceptor('photo'))
  async updateCoverPhoto(
    @Req() req: any,
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
    const s3response = await this.uploadService.upload(file)
    const id = req.user.sub;

    return this.restaurantService.updateCoverPhoto(id, s3response);
  }

  @Delete(':id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete restaurent' })
  remove(@Param('id') id: string) {
    return this.restaurantService.remove(id);
  }
}
