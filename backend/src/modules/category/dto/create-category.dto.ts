import { ApiProperty } from "@nestjs/swagger";
import { IsEmpty, IsEnum, IsOptional, IsString } from "class-validator";
import { CategoryStatus } from "src/helper/types/index.type";

export class CreateCategoryDto {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo: any;
}
