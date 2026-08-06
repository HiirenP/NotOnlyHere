import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ANONYMOUS_DAILY_LIMIT, nextUtcMidnight, utcUsageDate } from './anonymous.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnonymousQuotaService {
  constructor(private readonly prisma: PrismaService) {}

  async getQuota(userId: string) {
    const usageDate = utcUsageDate();
    const row = await this.prisma.anonymousUsageDaily.findUnique({
      where: { userId_usageDate: { userId, usageDate } },
    });
    const used = row?.contributionCount ?? 0;
    const remaining = Math.max(ANONYMOUS_DAILY_LIMIT - used, 0);
    return {
      limit: ANONYMOUS_DAILY_LIMIT,
      used,
      remaining,
      resetsAt: nextUtcMidnight().toISOString(),
    };
  }

  async consumeQuota(userId: string) {
    const usageDate = utcUsageDate();
    const rows = await this.prisma.$queryRaw<{ contribution_count: number }[]>`
      WITH updated AS (
        INSERT INTO anonymous_usage_daily (user_id, usage_date, contribution_count, created_at, updated_at)
        VALUES (${userId}::uuid, ${usageDate}::date, 1, NOW(), NOW())
        ON CONFLICT (user_id, usage_date)
        DO UPDATE SET
          contribution_count = anonymous_usage_daily.contribution_count + 1,
          updated_at = NOW()
        WHERE anonymous_usage_daily.contribution_count < ${ANONYMOUS_DAILY_LIMIT}
        RETURNING contribution_count
      )
      SELECT contribution_count FROM updated
    `;

    if (rows.length === 0) {
      const quota = await this.getQuota(userId);
      throw new HttpException(
        {
          code: 'ANONYMOUS_QUOTA_EXCEEDED',
          message: 'Daily anonymous contribution limit reached.',
          quota,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }
}
