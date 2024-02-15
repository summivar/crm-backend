import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from './exception.constants';
import { ErrorEnum } from '../../exceptions';

export class UserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.USER_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class FromUserNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.FROM_USER_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
