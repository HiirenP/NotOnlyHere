import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AiController } from './ai.controller';
import { AiProviderService } from './ai-provider.service';
import { AiService } from './ai.service';

@Module({
  imports: [AuthModule],
  controllers: [AiController],
  providers: [AiService, AiProviderService],
  exports: [AiService],
})
export class AiModule {}
