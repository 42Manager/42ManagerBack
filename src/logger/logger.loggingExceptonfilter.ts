import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { winstonLogger } from './logger.winstonLogger';

@Catch(HttpException)
export class LoggingExceptionfilter implements ExceptionFilter {
private readonly logger = winstonLogger;

catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const message = exception.message;
    this.logger.error(
    `[${request.method}][${request.ip}][${request.url}] ERR(${status}) ${exception}`
    );
    response.status(status).json({
    statusCode: status,
    timestamp: new Date().toISOString(),
    path: request.url,
    });
}
}