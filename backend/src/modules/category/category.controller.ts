import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, ParseFilePipe, Req, UploadedFile, UseInterceptors, Query, UseGuards, ParseUUIDPipe, UnauthorizedException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UploadService } from 'src/helper/utils/files_upload';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateCategoryDto } from './dto/create-category.dto';
import { PhotoUpdateDto } from './dto/PhotoUpdate.dto';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';

@ApiTags('Category')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly uploadService: UploadService
  ) { }

  @Post()
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_CATEGORY)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create category' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateCategoryDto })
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Req() req: any,
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          // new MaxFileSizeValidator({ maxSize: 1000 }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
        ],
      }),
    )
    file?: Express.Multer.File,
  ) {
    let s3response
    if (file) {
      // s3response = await this.uploadService.upload(
      //   file.originalname,
      //   file.buffer,
      // );
      s3response = await this.uploadService.upload(file)
    } else {
      s3response = createCategoryDto.photo
    }
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.categoryService.create(createCategoryDto, s3response, restaurantid);
    }
    const id = req.user.sub;
    return this.categoryService.create(createCategoryDto, s3response, id);
  }

  @Get('getAll')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_CATEGORY, PermissionType.CREATE_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all  by token' })
  findAllByToken(@Req() req: any, @Query() paginationDto?: PaginationDto,) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req?.user?.rId;
      return this.categoryService.findAllByToken(restaurantid, paginationDto);
    } else if (req.user.role === roleType.admin) {
      const restaurantid = req?.user?.sub;
      return this.categoryService.findAllByToken(restaurantid, paginationDto);
    } else {
      throw new UnauthorizedException("Unauthorized request")
    }
  }

  @Get('getAll/:id')
  @ApiOperation({ summary: 'get all categories' })
  findAll(@Param('id') restaurantid: string) {
    return this.categoryService.findAll(restaurantid);
  }

  @Get('filter/:restroId')
  @ApiQuery({ name: 'category' })
  @ApiOperation({ summary: 'search product by name category' })
  filterProduct(@Param('restroId', ParseUUIDPipe) restroId: string, @Query('category') category: string) {
    return this.categoryService.filterCategory(restroId, category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get category' })
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(id);
  }


  @Patch('update-info/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_CATEGORY)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update category info' })
  @ApiBody({ type: UpdateCategoryDto })
  update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Patch('update-photo/:id')
  @Roles(roleType.admin, roleType.staff)
  @UseGuards(AtGuard, RolesGuard)
  @Permissions(PermissionType.UPDATE_CATEGORY)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update category photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PhotoUpdateDto })
  @UseInterceptors(FileInterceptor('photo'))
  async updatePhoto(
    @Param('id') id: string,
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
    return this.categoryService.updatePhoto(id, s3response);
  }


  @Delete(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_CATEGORY)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete category' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}

