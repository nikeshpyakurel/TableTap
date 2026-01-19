import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreatePackageDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    description: string;

    @IsNumber()
    @ApiProperty()
    total_categories: number;

    @IsNumber()
    @ApiProperty()
    total_table: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    monthly_price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    yearly_price: number;

    @IsNumber()
    @ApiProperty()
    total_products: number;

    @IsNumber()
    @ApiProperty()
    total_user: number;
}

export class UpdatePackageDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    name: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    description: string;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    total_categories: number;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    total_table: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    @IsOptional()
    monthly_price: number;

    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    @IsOptional()
    yearly_price: number;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    total_products: number;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    total_user: number;
}
