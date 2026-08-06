import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class StructuredLogger implements LoggerService {
  private write(level: string, message: unknown, context?: string) {
    const payload = {
      level,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      context,
      timestamp: new Date().toISOString(),
    };
    // eslint-disable-next-line no-console
    console.log(JSON.stringify(payload));
  }

  log(message: unknown, context?: string) {
    this.write('info', message, context);
  }

  error(message: unknown, trace?: string, context?: string) {
    this.write('error', { message, trace }, context);
  }

  warn(message: unknown, context?: string) {
    this.write('warn', message, context);
  }

  debug(message: unknown, context?: string) {
    if (process.env.LOG_LEVEL === 'debug') {
      this.write('debug', message, context);
    }
  }

  verbose(message: unknown, context?: string) {
    this.write('verbose', message, context);
  }
}
