import { PartialType } from '@nestjs/mapped-types';
import { CreateSuperAdminDto } from './create-super-admin.dto';
import { CreateFAQDto } from './faq.dto';

export class UpdateSuperAdminDto extends PartialType(CreateSuperAdminDto) {}
export class UpdateFaqDto extends PartialType(CreateFAQDto) {}
