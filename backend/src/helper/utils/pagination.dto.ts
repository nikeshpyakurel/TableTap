import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, IsOptional, Min } from 'class-validator';

export class PaginationDto {
    @Transform(({ value }) => value ? parseInt(value) : 1)
    @ApiPropertyOptional({ default: 1 })
    @IsInt()
    @Min(1)
    @IsOptional()
    page: number = 1;

    @Transform(({ value }) => value ? parseInt(value) : 10)
    @ApiPropertyOptional({ default: 10 })
    @IsInt()
    @Min(1)
    @IsOptional()
    pageSize: number = 10;
}
