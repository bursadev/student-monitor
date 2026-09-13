import {
  type ArgumentsHost,
  Catch,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

import { isNestDefaultMessage, messageForStatus } from './error-messages.js';

interface ErrorBody {
  statusCode: number;
  message: string;
}

/**
 * The single place an error becomes an HTTP response.
 *
 * Two jobs. First, every failure answers in Turkish and in one shape, instead
 * of Nest's English defaults, Prisma's `P2002` prose or Clerk's API strings
 * reaching a user. Second, nothing about our internals — connection strings,
 * table names, stack traces — crosses the wire; the real cause is logged
 * server-side instead.
 *
 * It deliberately does *not* rewrite 403 into 404. Returning "not found" for a
 * row the caller may not see is a real rule here, but it belongs at the call
 * site where the decision is visible in the diff — hiding it in a global filter
 * would make every controller's authorization behaviour invisible.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const http = host.switchToHttp();
    const res = http.getResponse<Response>();
    const req = http.getRequest<Request>();

    const body = this.toBody(exception);

    // Only genuine server-side faults are worth a log line; a 404 or a rejected
    // token is the API working as designed. Method and path only — never the
    // body, the query or the token (see Security and Privacy).
    if (body.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
      const cause =
        exception instanceof Error ? `${exception.name}: ${exception.message}` : String(exception);
      this.logger.error(`${req.method} ${req.url} failed: ${cause}`);
    }

    res.status(body.statusCode).json(body);
  }

  private toBody(exception: unknown): ErrorBody {
    if (exception instanceof HttpException) {
      const statusCode = exception.getStatus();
      return { statusCode, message: this.httpExceptionMessage(exception, statusCode) };
    }

    const mapped = this.mappedStatus(exception);
    if (mapped) return { statusCode: mapped, message: messageForStatus(mapped) };

    return {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: messageForStatus(HttpStatus.INTERNAL_SERVER_ERROR),
    };
  }

  /**
   * Keep a message somebody wrote for a user; translate anything else. An array
   * response is what a ValidationPipe produces, and those strings come from
   * class-validator in English — fall back rather than relay them.
   */
  private httpExceptionMessage(exception: HttpException, statusCode: number): string {
    const response = exception.getResponse();

    const raw =
      typeof response === 'string'
        ? response
        : (response as { message?: unknown })?.message;

    if (typeof raw === 'string' && raw.length > 0 && !isNestDefaultMessage(raw)) {
      return raw;
    }

    return messageForStatus(statusCode);
  }

  /** Failures from a library that never learned about our HTTP contract. */
  private mappedStatus(exception: unknown): number | null {
    if (typeof exception !== 'object' || exception === null) return null;

    const { code, clerkError, status } = exception as {
      code?: unknown;
      clerkError?: unknown;
      status?: unknown;
    };

    // Prisma known-request errors are identified by their PXXXX code.
    if (typeof code === 'string' && /^P\d{4}$/.test(code)) {
      if (code === 'P2025') return HttpStatus.NOT_FOUND;
      if (code === 'P2002') return HttpStatus.CONFLICT;
      return HttpStatus.INTERNAL_SERVER_ERROR;
    }

    // Clerk Backend API errors carry `clerkError` and the upstream HTTP status.
    if (clerkError === true && status === 404) return HttpStatus.NOT_FOUND;

    return null;
  }
}
