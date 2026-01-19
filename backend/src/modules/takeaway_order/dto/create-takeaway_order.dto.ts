import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Column } from "typeorm";

class AddOnDto {
    @IsString()
    @ApiProperty()
    @IsOptional()
    addOnId: string;
}

class CreateTakeawayOrderItemDto {

    @IsString()
    @ApiProperty()
    @IsOptional()
    productId: string;

    @ApiProperty()
    @IsNumber()
    quantity: number;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    price?: number;


    @ApiProperty({ type: [AddOnDto], description: "List of addon items" })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddOnDto)
    addOn?: AddOnDto[];
}

export class CreateTakeawayOrderDto {

    @IsOptional()
    @ApiProperty()
    @IsString()
    customerName?: string

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    @Column({ type: 'bigint' })
    phone?: number;

    @IsOptional()
    @ApiProperty()
    @IsNumber()
    discount?: number;

    @ApiProperty({ type: [CreateTakeawayOrderItemDto], description: "List of order items" })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateTakeawayOrderItemDto)
    orderItems: CreateTakeawayOrderItemDto[];

}





