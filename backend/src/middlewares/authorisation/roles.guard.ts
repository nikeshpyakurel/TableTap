// import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
// import { Reflector } from '@nestjs/core';
// import { PERMISSION_KEY, ROLES_KEY } from './roles.decorator';
// import { Request } from 'express';
// import { roleType, PermissionType } from 'src/helper/types/index.type';

// @Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(private reflector: Reflector) { }
//     canActivate(context: ExecutionContext): boolean {
//         const requiredRoles = this.reflector.getAllAndOverride<roleType[]>(ROLES_KEY, [
//             context.getHandler(),
//             context.getClass(),
//         ]);
//         const requiredPermissions = this.reflector.get<PermissionType[]>(PERMISSION_KEY, context.getHandler());
//         if (!requiredRoles && !requiredPermissions) {
//             return true;
//         }
//         const { user } = context.switchToHttp().getRequest();
//         if (user.role === roleType.staff) {
//             // uers.permission = ['Category_management', 'Order_management'];
//             return requiredPermissions.some((permission) => user.permission?.includes(permission));
//         }
//         return requiredRoles.some((role) => user.role?.includes(role));
//     }
// }


import { Injectable, CanActivate, ExecutionContext, UnprocessableEntityException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY, ROLES_KEY } from './roles.decorator';
import { roleType, PermissionType } from 'src/helper/types/index.type';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<roleType[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const requiredPermissions = this.reflector.getAllAndOverride<PermissionType[]>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        const { user } = context.switchToHttp().getRequest();

        // Allow access if no roles and no permissions are required
        if (!requiredRoles && !requiredPermissions) {
            return true;
        }

        console.log(user)
        console.log(requiredPermissions)

        // Check roles
        if (requiredRoles?.includes(user.role)) {
            // Staff requires additional permission check
            if (user.role === roleType.staff) {
                if (!user.permissions || user.permissions.length === 0) {
                    throw new UnprocessableEntityException('Staff without permissions cannot proceed');
                }
                if (requiredPermissions === undefined) {
                    return true;
                } else {
                    return requiredPermissions?.some(permission =>
                        user.permissions.includes(permission),
                    );
                }
            }

            // For restaurant and super_admin, roles alone are sufficient
            return true;
        }

        // Deny access by default
        return false;
    }
}