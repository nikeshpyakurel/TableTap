import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsString } from "class-validator";
import { BusinessType } from "src/helper/types/index.type";

export class CreateEnquiryDto {

    @IsString()
    @ApiProperty()
    name:string;

    @IsString()
    @ApiProperty()
    contact:string;

    @IsEmail()
    @ApiProperty()
    email:string;

    @IsString()
    @ApiProperty()
    businessName:string;

    @IsString()
    @ApiProperty({enum:BusinessType})
    businessType:BusinessType;
    
}
