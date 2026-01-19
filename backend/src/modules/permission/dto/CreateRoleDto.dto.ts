import { ApiProperty } from "@nestjs/swagger";
import { uuid } from "aws-sdk/clients/customerprofiles";
import { IsArray, IsString } from "class-validator";

export class CreateRoleDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsArray()
    @ApiProperty()
    permissionIds: [uuid]
}