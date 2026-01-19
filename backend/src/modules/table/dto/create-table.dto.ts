import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { tableStatus } from "src/helper/types/index.type";

export class CreateTableDto {

    @IsString()
    @ApiProperty()
    name: string

}
