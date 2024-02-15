import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from './exception.constants';
import { ErrorEnum } from '../../exceptions';

export class UnauthorizedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.UNAUTHORIZED,
        message: EXCEPTION.USER_IS_NOT_AUTHORIZED,
        error: ErrorEnum.UNAUTHORIZED,
      },
      HttpStatus.UNAUTHORIZED
    );
  }
}

export class InvalidSignupStringException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.INVALID_SIGNUP_STRING,
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

export class PasswordNotMatchedException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.PASSWORD_NOT_MATCHED,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class UserAlreadyExistsException extends HttpException {
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

export class ForbiddenException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.FORBIDDEN,
        message: EXCEPTION.NOT_RULES_FOR,
        error: ErrorEnum.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN
    );
  }
}
