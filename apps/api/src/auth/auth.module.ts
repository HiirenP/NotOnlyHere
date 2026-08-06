import { Module } from '@nestjs/common';
import { AccountSessionsController, AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { EmailTokenService } from './email-token.service';
import { OAuthController } from './oauth.controller';
import { OAuthService } from './oauth.service';
import { PasswordService } from './password.service';
import { SessionService } from './session.service';
import { OutboxModule } from '../outbox/outbox.module';

@Module({
  imports: [OutboxModule],
  controllers: [AuthController, AccountSessionsController, OAuthController],
  providers: [
    AuthService,
    SessionService,
    AuthGuard,
    PasswordService,
    EmailTokenService,
    OAuthService,
  ],
  exports: [SessionService, AuthGuard, AuthService, EmailTokenService],
})
export class AuthModule {}
