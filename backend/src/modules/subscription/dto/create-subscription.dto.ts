import { IsDate, IsDateString, IsDecimal, IsISO8601, IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSubscriptionDto {
    @IsString()
    // @Type(() => Date)
    @ApiProperty()
    startDate: Date;

    @IsString()
    // @Type(() => Date)
    @ApiProperty()
    endDate: Date;

    @IsUUID()
    @ApiProperty()
    restaurantId: string;

    @IsUUID()
    @ApiProperty()
    packageId: string;

    @IsString()
    @ApiProperty()
    mode: string;

    @ApiProperty({ required: false, type: 'string', format: 'binary' })
    @IsOptional()
    proof: any;

    @IsNumber({ maxDecimalPlaces: 2 })
    @ApiProperty()
    amount: number;
}
