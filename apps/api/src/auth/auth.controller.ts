import { Body, Controller, Delete, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { SessionService } from './session.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
    private readonly prisma: PrismaService,
  ) {}

  @Post('register')
  register(
    @Body()
    body: {
      displayName: string;
      username: string;
      email: string;
      password: string;
      ageConfirmed: boolean;
      termsAccepted: boolean;
      privacyAccepted: boolean;
      guidelinesAccepted: boolean;
    },
  ) {
    return this.auth.register(body);
  }

  @Post('login')
  login(
    @Body() body: { email: string; password: string; returnTo?: string },
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.login(body.email, body.password, res, req, body.returnTo);
  }

  @Post('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.auth.logout(req, res);
  }

  @Post('logout-all')
  @UseGuards(AuthGuard)
  logoutAll(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.auth.logoutAll(req, res);
  }

  @Post('email/verify')
  verifyEmail(@Body() body: { token: string }) {
    return this.auth.verifyEmail(body.token);
  }

  @Post('email/resend')
  resendVerification(@Body() body: { email: string }) {
    return this.auth.resendVerification(body.email);
  }

  @Post('password/forgot')
  forgotPassword(@Body() body: { email: string }) {
    return this.auth.forgotPassword(body.email);
  }

  @Post('password/reset')
  resetPassword(@Body() body: { token: string; password: string }) {
    return this.auth.resetPassword(body.token, body.password);
  }

  @Post('dev-session')
  async devSession(@Body() body: { email?: string }, @Res({ passthrough: true }) res: Response) {
    const email = body.email ?? 'demo@notonlyhere.local';
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      return { ok: false, message: 'Seed user not found. Run npm run db:seed.' };
    }
    const sessionId = await this.sessions.createDevSession(user.id, res);
    return { ok: true, sessionId };
  }
}

@Controller('account/sessions')
@UseGuards(AuthGuard)
export class AccountSessionsController {
  constructor(private readonly sessions: SessionService) {}

  @Get()
  list(@Req() req: Request & { user: { id: string } }) {
    const currentId = this.sessions.getCurrentSessionId(req);
    return this.sessions.listSessions(req.user.id, currentId);
  }

  @Delete(':id')
  async revoke(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    const owned = await this.sessions.listSessions(req.user.id);
    if (!owned.some((session) => session.id === id)) {
      return { ok: false };
    }
    await this.sessions.revokeSession(id, 'revoked_by_user');
    return { ok: true };
  }
}
