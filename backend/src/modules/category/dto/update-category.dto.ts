import { ApiProperty } from "@nestjs/swagger";
import { StatusType } from "aws-sdk/clients/codebuild";
import { IsOptional, IsString } from "class-validator";

export class UpdateCategoryDto {
    @ApiProperty()
    @IsString()
    @IsOptional()
    name: string;

    @ApiProperty()
    @IsOptional()
    status: StatusType;

}
