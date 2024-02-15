import { HttpException, HttpStatus } from '@nestjs/common';
import { EXCEPTION } from './exception.constants';
import { ErrorEnum } from '../../exceptions';

export class ClientNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.CLIENT_NOT_FOUND,
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

export class StatusNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.STATUS_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class SolutionsNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.SOLUTIONS_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class SolutionNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.SOLUTION_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class StuffsNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.STUFFs_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class StuffNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.STUFF_NOT_FOUND,
        error: ErrorEnum.BAD_REQUEST,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}

export class OrderNotFoundException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: EXCEPTION.ORDER_NOT_FOUND,
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
