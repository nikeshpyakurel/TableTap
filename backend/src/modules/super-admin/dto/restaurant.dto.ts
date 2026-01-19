import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEmail, IsString, IsUUID, MinLength } from "class-validator";

export class CreateRestaurant {
    @IsString()
    @ApiProperty()
    name: string;

    @IsString()
    @ApiProperty()
    phone: string;

    @IsString()
    @ApiProperty()
    address: string;

    @IsString()
    @ApiProperty()
    zip_code: string;

    @IsEmail()
    @ApiProperty()
    email: string;

    @IsString()
    @ApiProperty()
    @MinLength(8)
    password: string
}

export class updateRestaurant {
    @IsUUID()
    @ApiProperty()
    id: string;

    @IsBoolean()
    @ApiProperty()
    isDisabled: boolean;
}
