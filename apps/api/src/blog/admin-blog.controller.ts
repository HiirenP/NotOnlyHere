import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import type { BlogStatus } from '@prisma/client';
import type { Request } from 'express';
import { AdminGuard, AdminPermission } from '../admin/admin.guard';
import { AuthGuard } from '../auth/auth.guard';
import { BlogService } from './blog.service';

@Controller('admin/blogs')
@UseGuards(AuthGuard, AdminGuard)
export class AdminBlogController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  @AdminPermission('blog.read')
  list(
    @Req() req: Request & { user: { id: string } },
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: BlogStatus,
  ) {
    return this.blog.listAdmin(req.user.id, { cursor, limit: limit ? Number(limit) : undefined, status });
  }

  @Post()
  @AdminPermission('blog.write')
  create(
    @Req() req: Request & { user: { id: string } },
    @Body()
    body: {
      title: string;
      excerpt: string;
      bodyPlain: string;
      bodyRich?: object;
      categorySlugs?: string[];
      tagSlugs?: string[];
    },
  ) {
    return this.blog.createPost(req.user.id, body);
  }

  @Get(':id')
  @AdminPermission('blog.read')
  get(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.blog.getAdminPost(req.user.id, id);
  }

  @Patch(':id')
  @AdminPermission('blog.write')
  update(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body()
    body: {
      title?: string;
      excerpt?: string;
      bodyPlain?: string;
      bodyRich?: object;
      version: number;
      categorySlugs?: string[];
      tagSlugs?: string[];
    },
  ) {
    return this.blog.updatePost(req.user.id, id, body);
  }

  @Post(':id/publish')
  @AdminPermission('blog.publish')
  publish(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.blog.publishPost(req.user.id, id);
  }

  @Post(':id/schedule')
  @AdminPermission('blog.publish')
  schedule(
    @Req() req: Request & { user: { id: string } },
    @Param('id') id: string,
    @Body() body: { scheduledAt: string },
  ) {
    return this.blog.schedulePost(req.user.id, id, body.scheduledAt);
  }

  @Post(':id/unpublish')
  @AdminPermission('blog.publish')
  unpublish(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.blog.unpublishPost(req.user.id, id);
  }

  @Delete(':id')
  @AdminPermission('blog.write')
  archive(@Req() req: Request & { user: { id: string } }, @Param('id') id: string) {
    return this.blog.archivePost(req.user.id, id);
  }
}
