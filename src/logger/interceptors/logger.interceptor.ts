import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { LoggerClientService } from '../services/logger.service';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  private request: Request;
  private response: Response;
  constructor(private readonly logger: LoggerClientService) {}
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startRequest = Date.now();
    const ctx = context.switchToHttp();
    this.request = ctx.getRequest<Request>();
    this.response = ctx.getResponse<Response>();
    return next.handle().pipe(
      tap((response) => {
        let log: any = {};
        log.method = this.request.method;
        log.statusCode = this.response.statusCode.toString();
        log.controller = context.getClass().name;
        log.function = context.getHandler().name;
        this.logger.logInterceptor(log);
      }),
    );
  }
}
