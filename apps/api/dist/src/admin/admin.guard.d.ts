import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AdminPermissionsService } from './admin-permissions.service';
export declare const ADMIN_PERMISSION_KEY = "adminPermission";
export declare const AdminPermission: (permission: string) => import("@nestjs/common").CustomDecorator<string>;
export declare class AdminGuard implements CanActivate {
    private readonly permissions;
    private readonly reflector;
    constructor(permissions: AdminPermissionsService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
