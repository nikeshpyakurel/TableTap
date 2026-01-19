import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeederService } from './seeder.service';
import { staffPermissionEntity } from '../model/staffPermission.entity';
import { hash } from 'src/helper/utils/hash';



@Module({
    imports: [TypeOrmModule.forFeature([staffPermissionEntity])],
    providers: [SeederService, hash],
    exports: [SeederService],
})
export class SeederModule { }
