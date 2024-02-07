import {
  Catch,
  ArgumentsHost,
  BadRequestException,
  HttpException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

type ExceptionType = { driverError: string; table: string, detail: string };

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter<
  HttpException | ExceptionType
> {
  public catch(exception: ExceptionType, host: ArgumentsHost): void {
    const {driverError = null, table = null, detail = null} = exception || {};

    if (driverError && driverError.toString().includes('null value')) {
      const column = driverError.toString().match(/column "(.*?)"/)[1];
      const relation = driverError.toString().match(/relation "(.*?)"/)[1];
      super.catch(
        new BadRequestException(`${column} is required in ${relation}`),
        host
      );
    }

    if (detail && table && detail.includes('already exists')) {
      const fieldName = detail.match(/Key \((.*?)\)=/)[1];
      const fieldValue = detail.match(/\)=(.*?) /)[1].replace(/^\((.*)\)$/, '$1');
      super.catch(
        new BadRequestException(`Key '${fieldName}' must be unique. Value '${fieldValue}' is already exists in '${table}'`),
        host,
      );
    }

    super.catch(new BadRequestException('tutu'), host);
  }
}
