import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsOptional, IsNumber, IsArray, ValidateNested } from "class-validator";


class AddOnDto {

    @ApiProperty()
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    addOnId: string;
}

class UpdateTakeawayOrderItemDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    id: string;

    @IsString()
    @ApiProperty()
    @IsOptional()
    productId: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    price: number;

    @IsOptional()
    @ApiProperty({ type: [AddOnDto], description: "List of addon items" })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => AddOnDto)
    addOn?: AddOnDto[];
}

export class UpdateTakeawayOrderDto {
    @ApiProperty()
    @IsOptional()
    @IsString()
    customerName?: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    phone?: number;

    @ApiProperty({ type: [UpdateTakeawayOrderItemDto], description: "List of order items" })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => UpdateTakeawayOrderItemDto)
    orderItems?: UpdateTakeawayOrderItemDto[];
}


