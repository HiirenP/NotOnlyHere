import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminPermissionsService {
  constructor(private readonly prisma: PrismaService) {}

  async getPermissions(userId: string) {
    const roles = await this.prisma.adminUserRole.findMany({
      where: { userId },
      include: { role: { include: { permissions: true } } },
    });
    const permissions = new Set<string>();
    for (const assignment of roles) {
      for (const permission of assignment.role.permissions) {
        permissions.add(permission.permission);
      }
    }
    return permissions;
  }

  async hasPermission(userId: string, permission: string) {
    const permissions = await this.getPermissions(userId);
    return permissions.has('*') || permissions.has(permission);
  }
}
