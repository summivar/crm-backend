import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from './exception.constants';
import { ErrorEnum } from '../../../exceptions';

export class CorporateClientAlreadyExistException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.ALREADY_EXISTS,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class CompanyNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.COMPANY_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class InfoTracerNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.INFOTRACER_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class CorporateClientNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.CORPORATECLIENT_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
