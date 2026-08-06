import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuditService } from '../audit/audit.service';
import { AdminAnonymousController } from './admin-anonymous.controller';
import { AdminGuard } from './admin.guard';
import { AdminPermissionsService } from './admin-permissions.service';

@Module({
  imports: [AuthModule],
  controllers: [AdminAnonymousController],
  providers: [AdminPermissionsService, AdminGuard, AuditService],
  exports: [AdminPermissionsService],
})
export class AdminModule {}
