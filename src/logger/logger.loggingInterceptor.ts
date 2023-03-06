import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { winstonLogger } from './logger.winstonLogger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = winstonLogger;
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    return next
      .handle()
      .pipe(
        tap({
            next: (val: unknown) : void => {
            this.logger.info(`[${request.method}][${request.ip}][${request.url}] SUCCESS(${response.statusCode})`);
            return ;
        }}
      ),
      );
  }
}