import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

type ErrorResponseBody = {
  message?: string | string[];
  error?: string;
  statusCode?: number;
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;

    const body = this.resolveBody(status, exceptionResponse);

    response.status(status).json({
      statusCode: status,
      error: body.error,
      message: body.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }

  private resolveBody(
    status: number,
    exceptionResponse: string | object | undefined,
  ): ErrorResponseBody {
    if (typeof exceptionResponse === 'string') {
      return {
        statusCode: status,
        error: this.resolveDefaultError(status),
        message: exceptionResponse,
      };
    }

    if (exceptionResponse && typeof exceptionResponse === 'object') {
      const responseBody = exceptionResponse as ErrorResponseBody;

      return {
        statusCode: responseBody.statusCode ?? status,
        error: responseBody.error ?? this.resolveDefaultError(status),
        message: responseBody.message ?? this.resolveDefaultError(status),
      };
    }

    return {
      statusCode: status,
      error: this.resolveDefaultError(status),
      message: this.resolveDefaultError(status),
    };
  }

  private resolveDefaultError(status: number) {
    return status === Number(HttpStatus.INTERNAL_SERVER_ERROR)
      ? 'Internal Server Error'
      : 'Request Error';
  }
}
