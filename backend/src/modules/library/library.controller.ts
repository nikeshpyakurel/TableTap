import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { LibraryService } from './library.service';
import { CreateLibraryDto } from './dto/create-library.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { roleType } from 'src/helper/types/index.type';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';

@Controller('library')
@ApiTags('img/icon Library')
export class LibraryController {
  constructor(
    private readonly libraryService: LibraryService,
    private readonly uploadService: UploadService
  ) { }

  @Post()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.superAdmin)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create icon' })
  @ApiBody({ type: CreateLibraryDto })
  @UseInterceptors(FileInterceptor('photo'))
  async create(@Body() createIconDto: CreateLibraryDto,
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
    return this.libraryService.create(createIconDto, s3response);
  }

  @Get()
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.superAdmin, roleType.admin)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all icons' })
  async findAll() {
    return this.libraryService.findAll();
  }

  @Delete(':id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.superAdmin)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an icon' })
  async delete(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.libraryService.delete(id);
  }

  // Create a new image
  @Post('image')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.superAdmin)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create image' })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiBody({ type: CreateLibraryDto })
  async createImage(
    @Body() createImageDto: CreateLibraryDto,
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
    return this.libraryService.createImage(createImageDto, s3response);
  }

  // Get all images
  @Get('image')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.superAdmin, roleType.admin)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'get all images' })
  async findAllImage() {
    return this.libraryService.findAllImage();
  }

  // Delete an image
  @Delete('image/:id')
  @UseGuards(AtGuard, RolesGuard)
  @Roles(roleType.superAdmin)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete an image' })
  async deleteImage(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.libraryService.deleteImage(id);
  }
}