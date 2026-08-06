import { Controller, Get, Header, Param, Query } from '@nestjs/common';
import { BlogService } from './blog.service';

@Controller('blogs')
export class BlogController {
  constructor(private readonly blog: BlogService) {}

  @Get()
  list(
    @Query('q') q?: string,
    @Query('category') category?: string,
    @Query('tag') tag?: string,
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
  ) {
    return this.blog.listPublished({ q, category, tag, cursor, limit: limit ? Number(limit) : undefined });
  }

  @Get('rss.xml')
  @Header('Content-Type', 'application/rss+xml; charset=utf-8')
  rss() {
    return this.blog.buildRssFeed();
  }

  @Get(':slug/related')
  related(@Param('slug') slug: string) {
    return this.blog.getRelated(slug);
  }

  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.blog.getPublishedBySlug(slug);
  }
}
