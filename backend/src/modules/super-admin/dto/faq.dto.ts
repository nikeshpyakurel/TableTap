import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateFAQDto {
  @IsString()
  @ApiProperty()
  question: string;

  @IsString()
  @ApiProperty()
  answer: string;
}
