import { HttpException, HttpStatus } from "@nestjs/common";

export class ValidationException extends HttpException {
  constructor(errors: any) {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        message: 'Validation error',
        errors,
      },
      HttpStatus.BAD_REQUEST
    );
  }
}
