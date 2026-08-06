import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { OutboxModule } from '../outbox/outbox.module';
import { AccountController } from './account.controller';
import { AccountDeletionService, AccountExportService } from './account-lifecycle.service';

@Module({
  imports: [AuthModule, OutboxModule],
  controllers: [AccountController],
  providers: [AccountExportService, AccountDeletionService],
})
export class AccountModule {}
