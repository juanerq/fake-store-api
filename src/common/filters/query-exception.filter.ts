import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  Logger,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply, FastifyRequest } from 'fastify';
import { QueryFailedError } from 'typeorm';
import { GenericResponseDto } from '../dto/generic-response.dto';

interface ErrorCode {
  httpStatus: HttpStatus;
  message: string;
}

const ERROR_CODES: Record<number, ErrorCode> = {
  23505: {
    httpStatus: HttpStatus.CONFLICT,
    message: 'Record already exists',
  },
  23503: {
    httpStatus: HttpStatus.NOT_FOUND,
    message: 'Record not exists',
  },
};

@Catch(QueryFailedError)
export class QueryExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(QueryExceptionFilter.name);

  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();

    const code = (exception as any).code;
    let httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let stack = `\n[ Stack ]: ${exception.stack}\n`;

    const errorCode: ErrorCode | undefined = ERROR_CODES[code];

    if (errorCode) {
      httpStatus = errorCode.httpStatus;
      message = errorCode.message;
      stack = '';
    }

    const logErrorMsg = `[ Exception Database (${code}) ]: ${exception.message} [ Path ]: ${request.url} ${stack}[ Query ]: ${exception.query}`;

    this.logger.error(logErrorMsg);

    const response: GenericResponseDto<QueryFailedError> = {
      status: false,
      path: request.url,
      statusCode: httpStatus,
      error: exception.name,
      message,
      result: exception,
    };

    reply.status(httpStatus).send(response);
  }
}
