import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exceptions';
import { EXCEPTION_MESSAGE } from '../constants';

@Catch()
export class CustomExceptionFilter implements ExceptionFilter {
  logger: Logger;

  catch(exception: any, host: ArgumentsHost) {
    this.logger = new Logger();
    this.logger.error(exception, CustomExceptionFilter.name);

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    let errorMessage = 'Something went wrong with the server';

    let errorData = null;

    if (exception instanceof ValidationException) {
      statusCode = exception.getStatus();
      const { errors } = exception.getResponse() as any;
      errorMessage = 'Validation Error';
      errorData = errors || null;
    } else if (process.env['NODE_ENV'] !== 'production') {
      if (exception instanceof HttpException) {
        statusCode = exception.getStatus();
        errorMessage = exception.message;
      } else {
        errorData = exception;
      }
    }

    if (
      exception
        .toString()
        .includes('TypeError: Cannot convert undefined or null to object')
    ) {
      statusCode = 400;
      errorMessage = EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA;
      errorData = null;
    }

    // Handle and customize the error response
    response.status(statusCode).json({
      statusCode,
      message: errorMessage,
      errors: errorData,
    });
  }
}
