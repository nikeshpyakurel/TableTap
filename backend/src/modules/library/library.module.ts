import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { iconLibrary } from 'src/model/iconLibrary.entity';
import { imgLibrary } from 'src/model/imgLibrary.entity';
import { UploadService } from 'src/helper/utils/files_upload';


@Module({
  imports: [TypeOrmModule.forFeature([iconLibrary, imgLibrary,])],
  controllers: [LibraryController],
  providers: [LibraryService, UploadService],
})
export class LibraryModule { }
