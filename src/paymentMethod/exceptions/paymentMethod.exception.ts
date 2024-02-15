import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from './exception.constants';
import { ErrorEnum } from '../../exceptions';

export class PaymentMethodAlreadyExistException extends HttpException {
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

export class PaymentMethodNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.PAYMENTMETHOD_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
