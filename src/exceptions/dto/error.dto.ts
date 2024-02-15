import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty({ enum: HttpStatus, default: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: HttpStatus

  @ApiProperty({ default: 'Error' })
  message: string

  @ApiProperty({ default: null })
  errors?: string
}