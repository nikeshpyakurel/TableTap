import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class filterProductDto {

    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsOptional()
    low?: number;

    @ApiProperty()
    @IsInt()
    @Min(1)
    @IsOptional()
    high?: number;

    @IsString()
    @ApiProperty()
    @IsOptional()
    name?:string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    category?:string;
}