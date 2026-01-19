import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";


export class AddOnDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsNumber()
    price: number;
}

export class CreateProductDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    description: string;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty()
    @IsNumber()
    price: number;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty()
    @IsNumber()
    @IsOptional()
    discount: number;

    @ApiProperty()
    @Transform(({ value }) => value === 'true')
    @IsBoolean()
    isVeg: boolean;

    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo: any;

    @ApiProperty()
    @IsArray()
    @IsUUID("all", { each: true })
    @Transform(({ value }) => Array.isArray(value) ? value : [value])  // Ensure value is always an array
    categoryIds: string[];

    @ApiProperty({ required: false })
    @IsOptional()
    addOn?: AddOnDto[];

    @ApiProperty()
    @IsString()
    isAgeRestricted: string;
}
