import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNumber, IsOptional } from "class-validator";
import { Transform } from "class-transformer";

export class UpdateAddonDto {
    @ApiProperty({ required: false })
    @IsOptional()
    @IsString()
    name: string;

    @Transform(({ value }) => parseInt(value))
    @ApiProperty({ required: false })
    @IsOptional()
    @IsNumber()
    price: number;
}