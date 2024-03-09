import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GenericResponseDto } from '../dto/generic-response.dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, GenericResponseDto<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<GenericResponseDto<T>> {
    return next.handle().pipe(
      map((res) => this.responseHandler<T>(res, context)),
      catchError((err: HttpException) =>
        throwError(() => this.errorHandler(err, context)),
      ),
    );
  }

  responseHandler<T>(res: T, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const statusCode = reply.statusCode;

    const response: GenericResponseDto<T> = {
      status: true,
      path: request.url,
      statusCode,
      result: res,
    };

    return response;
  }

  errorHandler(exception: HttpException, context: ExecutionContext) {
    const ctx = context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof QueryFailedError) return exception;

    const result =
      exception instanceof HttpException ? exception.getResponse() : exception;

    const response: GenericResponseDto<any> = {
      result,
      status: false,
      path: request.url,
      statusCode: status,
      error: exception.name,
      message: exception.message,
    };

    console.error(exception);

    reply.status(status).send(response);
  }
}
