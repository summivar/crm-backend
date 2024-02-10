import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPaymentMethodDto {
  @ApiProperty({example: 'Картой'})
  @IsString()
  @IsOptional()
  name: string;
}