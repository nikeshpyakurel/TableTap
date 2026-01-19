import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { adPage, adType } from 'src/helper/types/index.type';

export class CreateAdvertisementDto {
  @IsString()
  @ApiProperty()
  @IsOptional()
  title?: string;

  @IsString()
  @ApiProperty()
  url: string;

  @IsEnum(adType)
  @ApiProperty({enum:adType})
  adType: adType;


  @IsDateString()
  @ApiProperty()
  startDate: string;

  @IsDateString()
  @ApiProperty()
  endDate: string;

  @ApiProperty({ required: false, type: 'string', format: 'binary' })
  @IsOptional()
  image: any;
}
