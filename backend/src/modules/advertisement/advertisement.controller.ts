import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from 'src/middlewares/authorisation/roles.decorator';
import { adActiveStatus, adType, roleType } from 'src/helper/types/index.type';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { RolesGuard } from 'src/middlewares/authorisation/roles.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateAdvertisementDto } from './dto/create-advertisement.dto';
import { UploadService } from 'src/helper/utils/files_upload';
import { query } from 'express';
import { PaginationDto } from 'src/helper/utils/pagination.dto';
import { UpdateAdvertisementDto } from './dto/update-advertisement.dto';

@ApiTags('Advertisement')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
@Controller('advertisement')
export class AdvertisementController {
  constructor(
    private readonly advertisementService: AdvertisementService,
    private readonly uploadService: UploadService,
  ) {}

  @Post('add')
  // @Roles(roleType.superAdmin)
  // @UseGuards(AtGuard, RolesGuard)
  // @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'create advertisement' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createAdvertisementDto: CreateAdvertisementDto,
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
    const s3response = await this.uploadService.upload(file);
    console.log(s3response)
    return this.advertisementService.create(createAdvertisementDto, s3response);
  }

  @Get('all')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'active ad' })
  @ApiQuery({name:'page'})
  @ApiQuery({name:'pageSize'})
  findAllAd(@Query() paginationDto?: PaginationDto){
    return this.advertisementService.findAllAd(paginationDto);
  }



  @Get('active-ad')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'active ad' })
  findActiveAd(){
    return this.advertisementService.findActiveAd();
  }

  @Get('find-by-adtype')
  @ApiQuery({name:"type",enum:adType})
  @ApiOperation({ summary: `Active ad by type` })
  findAdType(@Query() query: {type:adType}){
    return this.advertisementService.findAdType(query.type);
  }

  @Patch('update-status/:id')
  // @Roles(roleType.superAdmin)
  // @UseGuards(AtGuard,RolesGuard)
  @ApiQuery({name:"status",enum:adActiveStatus})
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ad status update'})
  updateAdStatus(@Param("id",ParseUUIDPipe) id:string,@Query() query:{status:adActiveStatus}){
    return this.advertisementService.updateAdStatus(id,query.status);
  }

  @Patch('update-click-count/:id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'count ad click' })
  updateClickAd(@Param("id",ParseUUIDPipe) id:string){
    return this.advertisementService.updateClickCount(id);
  }

  @Patch(':id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ad update' })
  updateAd(@Param("id",ParseUUIDPipe) id:string,  @Body() updateAdvertisementDto: UpdateAdvertisementDto){
    return this.advertisementService.updateAd(id,updateAdvertisementDto);
  }

  @Delete(':id')
  @Roles(roleType.superAdmin)
  @UseGuards(AtGuard,RolesGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'ad delete' })
  deleteAd(@Param("id",ParseUUIDPipe) id:string){
    return this.advertisementService.deleteAd(id);
  }

}
