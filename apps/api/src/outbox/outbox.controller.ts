import { Controller, Post } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OutboxService } from './outbox.service';

@Controller('internal/outbox')
export class OutboxController {
  constructor(private readonly outbox: OutboxService) {}

  @Post('noop')
  async emitNoop() {
    const event = await this.outbox.emitNoop(randomUUID(), 'phase0-walking-skeleton');
    return { id: event.id, status: event.status };
  }
}
