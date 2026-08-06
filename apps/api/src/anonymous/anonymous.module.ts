import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AnonymousController } from './anonymous.controller';
import { AnonymousQuotaService } from './anonymous-quota.service';
import { AnonymousService } from './anonymous.service';

@Module({
  imports: [AuthModule],
  controllers: [AnonymousController],
  providers: [AnonymousQuotaService, AnonymousService],
  exports: [AnonymousQuotaService, AnonymousService],
})
export class AnonymousModule {}
