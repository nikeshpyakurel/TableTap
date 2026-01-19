import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateStaffTypeDto {
  @IsOptional()
  @IsString()
  @ApiProperty()
  name?: string;

  @IsOptional()
  @ApiProperty()
  @IsArray()
  @IsUUID('4', { each: true })
  permissionIds?: string[];
}
