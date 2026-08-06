import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import type { Response } from 'express';
import { OAuthService } from './oauth.service';

@Controller('auth/oauth')
export class OAuthController {
  constructor(private readonly oauth: OAuthService) {}

  @Get(':provider/start')
  start(@Param('provider') provider: string, @Query('returnTo') returnTo: string, @Res() res: Response) {
    return this.oauth.start(provider, returnTo, res);
  }

  @Get(':provider/callback')
  callback(
    @Param('provider') provider: string,
    @Query('code') code: string,
    @Query('state') state: string,
    @Res() res: Response,
  ) {
    return this.oauth.callback(provider, code, state, res);
  }
}
