import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsArray, IsBoolean, IsEnum, IsNumber, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { productAddOnEntity } from 'src/model/Product_Addon.entity';
import { ProductStatus } from 'src/helper/types/index.type';
import { UpdateAddonDto } from './update-Addon.dto';


export class UpdateProductDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description: string;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price: number;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    discount: number;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    isVeg: boolean;

    @ApiProperty()
    @IsEnum(ProductStatus)
    @IsOptional()
    status: ProductStatus;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    special: boolean;

    @ApiProperty()
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    categoryIds: string[];

    @ApiProperty()
    @IsOptional()
    isAgeRestricted: boolean;
}
