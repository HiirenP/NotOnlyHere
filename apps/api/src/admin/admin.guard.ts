import { CanActivate, ExecutionContext, ForbiddenException, Injectable, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { AdminPermissionsService } from './admin-permissions.service';

export const ADMIN_PERMISSION_KEY = 'adminPermission';
export const AdminPermission = (permission: string) => SetMetadata(ADMIN_PERMISSION_KEY, permission);

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private readonly permissions: AdminPermissionsService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<Request & { user?: { id: string } }>();
    const user = req.user;
    if (!user) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Admin access required.' });
    }

    const required = this.reflector.get<string>(ADMIN_PERMISSION_KEY, context.getHandler());
    if (!required) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Admin permission not configured.' });
    }

    const allowed = await this.permissions.hasPermission(user.id, required);
    if (!allowed) {
      throw new ForbiddenException({ code: 'FORBIDDEN', message: 'Insufficient admin permissions.' });
    }
    return true;
  }
}
