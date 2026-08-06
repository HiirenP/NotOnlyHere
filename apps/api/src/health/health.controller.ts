import { Controller, Get } from '@nestjs/common';
import type { HealthResponse } from '@notonlyhere/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('live')
  live(): HealthResponse {
    return { status: 'ok' };
  }

  @Get('startup')
  startup(): HealthResponse {
    return { status: 'ok' };
  }

  @Get('ready')
  async ready(): Promise<HealthResponse> {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        checks: { database: { status: 'ok' } },
      };
    } catch (error) {
      return {
        status: 'error',
        checks: {
          database: {
            status: 'error',
            message: error instanceof Error ? error.message : 'unknown',
          },
        },
      };
    }
  }
}
