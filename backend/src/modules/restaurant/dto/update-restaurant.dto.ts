import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional, IsNumber } from 'class-validator';

export class UpdateRestaurantDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    address?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    phone?: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    theme?: string;
}
