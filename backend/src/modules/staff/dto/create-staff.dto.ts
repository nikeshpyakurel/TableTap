import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateStaffDto {
    @IsString()
    @ApiProperty()
    name: string;

    @IsUUID()
    @ApiProperty()
    staffTypeId: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsNumber()
    @ApiProperty()
    phone: number;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    password: string;
}