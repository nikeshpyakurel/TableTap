import { SetMetadata } from '@nestjs/common';
import { roleType as Role, PermissionType } from 'src/helper/types/index.type';

export const ROLES_KEY = 'roles';
export const PERMISSION_KEY = 'permissions';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
export const Permissions = (...permissions: PermissionType[]) => SetMetadata(PERMISSION_KEY, permissions);