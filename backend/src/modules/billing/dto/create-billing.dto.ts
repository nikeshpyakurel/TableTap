import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString} from "class-validator";

export class CreateBillingDto {

    @IsOptional()
    @IsString()
    @ApiProperty()
    tableId?:string;
   
    @IsOptional()
    @IsString()
    @ApiProperty()
    orderId?:string;

    @IsOptional()
    @IsString()
    @ApiProperty()
    takeAwayOrderId?:string;

    @IsNumber()
    @ApiProperty()
    amount:number;
    
    @IsNumber()
    @ApiProperty()
    discount:number


    @IsOptional()
    @IsString()
    @ApiProperty()
    remarks?:string;
}
