import { applyDecorators, HttpStatus } from '@nestjs/common';
import {
  ApiResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ErrorDto, ErrorEnum } from '../../../exceptions';

export function ApiErrorDecorator(
  message: string,
  error: ErrorEnum,
  statusCode: HttpStatus,
  description?: string,
  options?: ApiResponseOptions,
) {
  return applyDecorators(
    ApiResponse({
      ...options,
      status: statusCode,
      description: description,
      schema: {
        default: {
          message: message,
          error: error,
          statusCode: statusCode,
        },
        type: getSchemaPath(ErrorDto),
      },
    }),
  );
}