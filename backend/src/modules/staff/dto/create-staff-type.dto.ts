import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray, IsOptional, IsUUID } from 'class-validator';

export class CreateStaffTypeDto {
    @IsNotEmpty()
    @ApiProperty({ example: 'admin' })
    @IsString()
    name: string;

    @IsArray()
    @ApiProperty()
    @IsUUID('all', { each: true })
    permissionIds: string[];

    @IsUUID()
    @ApiProperty()
    restaurantId?: string;
}