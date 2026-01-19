import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from "class-validator";

export class UpdateStaffDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    name?: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    address?: string;

    @IsNumber()
    @ApiProperty()
    @IsOptional()
    // @Length(10, 10, { message: 'Phone number must be exactly 10 characters' })
    phone?: number;

    @IsUUID()
    @ApiProperty()
    @IsOptional()
    staffType?: string;
}
