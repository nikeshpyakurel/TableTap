import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { tableStatus } from "src/helper/types/index.type";

export class UpdateTableDto {
    @IsString()
    @ApiPropertyOptional()
    @IsOptional()
    name: string

    @IsEnum(tableStatus)
    @ApiPropertyOptional()
    @IsOptional()
    status: tableStatus;
}
