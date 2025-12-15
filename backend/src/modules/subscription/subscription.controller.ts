import { Controller, Get, Post, Body, Param, Put, Delete, ParseIntPipe, Query, ParseUUIDPipe, Patch, FileTypeValidator, ParseFilePipe, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { subscriptionEntity } from 'src/model/subscription.entity';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from 'src/helper/utils/files_upload';

@ApiTags('subscription')
@Controller('subscriptions')
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService,
        private readonly uploadService: UploadService
    ) { }

    @Post()
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('proof'))
    async create(@Body() createSubscriptionDto: CreateSubscriptionDto, @UploadedFile(
        new ParseFilePipe({
            validators: [
                // new MaxFileSizeValidator({ maxSize: 1000 }),
                new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
            ], fileIsRequired: false
        }),
    )
    file?: Express.Multer.File,
    ) {
        const s3response = await this.uploadService.upload(file);
        if (s3response) {
            createSubscriptionDto.proof = s3response;
        }


        // return this.subscriptionService.create(createSubscriptionDto);
    }

    @Get()
    async findAll(): Promise<subscriptionEntity[]> {
        return this.subscriptionService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', ParseIntPipe) id: string,
        @Query('page') page: number,
        @Query('limit') limit: number): Promise<subscriptionEntity> {
        return this.subscriptionService.findOne(id);
    }

    @Patch(':id')
    async update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() updateSubscriptionDto: UpdateSubscriptionDto,
    ): Promise<subscriptionEntity> {
        return this.subscriptionService.update(id, updateSubscriptionDto);
    }

    @Delete(':id')
    async delete(@Param('id', ParseUUIDPipe) id: string): Promise<Boolean> {
        return this.subscriptionService.delete(id);
    }
}