import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";

export class UpdatePhotoDto {
    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    photo: any;
}