import { Controller, Get, Post, Body, Patch, Param, Delete, FileTypeValidator, ParseFilePipe, Req, UploadedFile, UseInterceptors, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UploadService } from 'src/helper/utils/files_upload';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { PhotoUpdateDto } from './dto/photoUpdate.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { PermissionType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { Roles, Permissions } from 'src/middlewares/authorisation/roles.decorator';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { UpdateAddonDto } from './dto/update-Addon.dto';
import { CreateAddonDto } from './dto/create-addon.dto';
import { filterProductDto } from 'src/helper/utils/filter-product.dto';

@ApiTags('Product')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
@Controller('product')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly uploadService: UploadService
  ) { }

  @Post('add')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_PRODUCT)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create product' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('photo'))
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: any,
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
    // const s3response = await this.uploadService.upload(
    //   file.originalname,
    //   file.buffer,
    // );
    const s3response = createProductDto.photo ? createProductDto.photo : await this.uploadService.upload(file);
    const id = req.user.sub;
    return this.productService.create(createProductDto, s3response, id);
  }


  @Post('create-Addon/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.CREATE_PRODUCT) @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  async createAddon(@Param('id') id: string, @Body() createAddonDto: CreateAddonDto) {
    return this.productService.addAddon(id, createAddonDto);
  }

  @Get('filter/:restroId')
  @ApiOperation({ summary: 'search product by name category' })
  filterProduct(@Param('restroId', ParseUUIDPipe) restroId: string, @Query() filterProductDto: filterProductDto) {
    return this.productService.filterProduct(restroId, filterProductDto);
  }

  @Get("getAll")
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_PRODUCT)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all products by token ' })
  findAllBy(@Req() req: any, @Query() paginationDto?: PaginationDto
  ) {
    if (req.user.role === roleType.staff) {
      const restaurantid = req.user.rId;
      return this.productService.findAllBy(restaurantid, paginationDto);
    }
    const id = req.user.sub;
    return this.productService.findAllBy(id, paginationDto);
  }

  @Get('product/:id')
  @ApiOperation({ summary: 'get all products ' })
  find(
    @Param('id') id: string
  ) {

    return this.productService.findAll(id);
  }

  @Get('special-product/:id')
  @ApiOperation({ summary: 'get all special products ' })
  findSpecial(
    @Param('id') id: string, @Query() paginationDto?: PaginationDto
  ) {
    return this.productService.showSpecial(id, paginationDto);
  }

  @Get('popular-product/:id')
  @ApiOperation({ summary: 'get all popular products ' })
  findPopular(
    @Param('id') id: string
  ) {
    return this.productService.findPopularItem(id);
  }


  @Get("get-by-category/:id")
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.VIEW_PRODUCT, PermissionType.CREATE_TAKEAWAYORDER)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all products by category ' })
  findAllByCategory(@Param('id') id: string, @Query() paginationDto?: PaginationDto
  ) {
    return this.productService.findAllByCategory(id, paginationDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'get product' })
  findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_PRODUCT)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update product info' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(id, updateProductDto);
  }


  @Patch('updatePhoto/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_PRODUCT)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update product photo' })
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
    const s3response = await this.uploadService.upload(file)
    return this.productService.updatePhoto(id, s3response);
  }

  @Patch('updateCoverPhoto/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_PRODUCT)
  @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'upload cover photo' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: PhotoUpdateDto })
  @UseInterceptors(FileInterceptor('photo'))
  async updateCoverPhoto(
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
    const s3response = await this.uploadService.upload(file)
    return this.productService.updateCoverPhoto(id, s3response);
  }


  @Patch('Addon/:id')
  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.UPDATE_PRODUCT) @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'update Addon info' })
  updateAddon(@Param('id', ParseUUIDPipe) id: string, @Body() updateAddonDto: UpdateAddonDto) {
    return this.productService.updateAddon(id, updateAddonDto);
  }



  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_PRODUCT) @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete productAddon' })
  @Delete('Addon/:id')
  removeAddon(@Param('id') id: string) {
    return this.productService.removeAddon(id);
  }

  @Roles(roleType.admin, roleType.staff)
  @Permissions(PermissionType.DELETE_PRODUCT) @UseGuards(AtGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'delete product' })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }
}