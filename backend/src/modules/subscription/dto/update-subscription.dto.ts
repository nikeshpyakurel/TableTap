import { IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSubscriptionDto {
    @IsOptional()
    @IsDate()
    @Type(() => Date)
    startDate?: Date;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    endDate?: Date;

    @IsOptional()
    @IsUUID()
    restaurantId?: string;

    @IsOptional()
    @IsUUID()
    packageId?: string;

    @IsOptional()
    @IsUUID()
    packagePaymentId?: string;
}
