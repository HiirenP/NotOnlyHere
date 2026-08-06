import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  NotFoundException,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuditService } from '../audit/audit.service';
import { AdminGuard, AdminPermission } from './admin.guard';
import { PrismaService } from '../prisma/prisma.service';

@Controller('admin/anonymous-authors')
@UseGuards(AuthGuard, AdminGuard)
export class AdminAnonymousController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Post(':type/:id/reveal')
  @AdminPermission('anonymous_identity.reveal')
  async reveal(
    @Req() req: Request & { user: { id: string }; requestId?: string },
    @Param('type') type: string,
    @Param('id') id: string,
    @Body() body: { reason?: string },
  ) {
    const reason = body.reason?.trim();
    if (!reason || reason.length < 8) {
      throw new BadRequestException({
        code: 'REASON_REQUIRED',
        message: 'A reason of at least 8 characters is required.',
      });
    }

    if (type === 'post') {
      const mapping = await this.prisma.postAnonymousAuthor.findUnique({
        where: { postId: id },
        include: { user: { include: { profile: true } } },
      });
      if (!mapping?.userId || !mapping.user) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: 'Anonymous post mapping not found.' });
      }

      await this.audit.record({
        actorUserId: req.user.id,
        action: 'anonymous_identity.reveal',
        targetType: 'post',
        targetId: id,
        result: 'SUCCESS',
        requestId: req.requestId,
        metadata: { reason },
      });

      return {
        type: 'post',
        targetId: id,
        userId: mapping.userId,
        email: mapping.user.email,
        username: mapping.user.profile?.username ?? null,
        displayName: mapping.user.profile?.displayName ?? null,
      };
    }

    if (type === 'comment') {
      const mapping = await this.prisma.commentAnonymousAuthor.findUnique({
        where: { commentId: id },
        include: { user: { include: { profile: true } } },
      });
      if (!mapping?.userId || !mapping.user) {
        throw new NotFoundException({ code: 'NOT_FOUND', message: 'Anonymous comment mapping not found.' });
      }

      await this.audit.record({
        actorUserId: req.user.id,
        action: 'anonymous_identity.reveal',
        targetType: 'comment',
        targetId: id,
        result: 'SUCCESS',
        requestId: req.requestId,
        metadata: { reason },
      });

      return {
        type: 'comment',
        targetId: id,
        userId: mapping.userId,
        email: mapping.user.email,
        username: mapping.user.profile?.username ?? null,
        displayName: mapping.user.profile?.displayName ?? null,
      };
    }

    throw new BadRequestException({ code: 'INVALID_TYPE', message: 'Type must be post or comment.' });
  }
}
