import { IsString, IsInt, IsArray, ValidateNested, IsNotEmpty, IsOptional, IsNumber, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { orderType } from 'src/helper/types/index.type';

class AddOnDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  addOnId: string;

  @IsInt()
  @ApiProperty()
  @IsOptional()
  quantity?: number;
}

class OrderInfoDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  product: string;

  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddOnDto)
  @ApiProperty({ type: () => AddOnDto, isArray: true })
  addOn?: AddOnDto[];  
}


export class CreateOrderDto {
  @IsInt()
  @ApiProperty()
  @IsNotEmpty()
  phone: number;  

  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  table: string; 

  @IsString()
  @ApiProperty()
  @IsOptional()
  remarks?: string; 

  @IsEnum(orderType)
  @ApiProperty({ enum: orderType })
  @IsOptional()
  type?: orderType; 

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderInfoDto)
  @ApiProperty({ type: () => OrderInfoDto, isArray: true })
  orderInfo: OrderInfoDto[];  
}


export class AddOrderDto {
  @IsString()
  @ApiProperty()
  @IsNotEmpty()
  orderId: string; 
  
  @IsString()
  @ApiProperty()
  @IsOptional()
  remarks?: string;

  @IsArray()
  @ApiProperty()
  @ValidateNested({ each: true })
  @Type(() => OrderInfoDto)
  orderInfo: OrderInfoDto[];  
}

export class addOrderQuantity{
  @IsString()
  @ApiProperty()
  orderItemId:string;

  @IsNumber()
  @ApiProperty()
  quantity:number
}
