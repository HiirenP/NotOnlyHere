import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Response } from 'express';
import type { ApiErrorBody } from '@notonlyhere/contracts';
import { REQUEST_ID_HEADER } from './request-id.middleware';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request & { headers: Record<string, string> }>();

    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const body: ApiErrorBody = {
      type: 'about:blank',
      title: HttpStatus[status] ?? 'Error',
      status,
      code: 'INTERNAL_ERROR',
      requestId: request.headers[REQUEST_ID_HEADER],
    };

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const payload = exceptionResponse as Record<string, unknown>;
      if (typeof payload.message === 'string') body.detail = payload.message;
      if (typeof payload.code === 'string') body.code = payload.code;
      if (payload.errors && typeof payload.errors === 'object') {
        body.errors = payload.errors as Record<string, string[]>;
      }
    } else if (exception instanceof Error && status === 500) {
      body.detail = 'An unexpected error occurred.';
    }

    response.status(status).json(body);
  }
}
