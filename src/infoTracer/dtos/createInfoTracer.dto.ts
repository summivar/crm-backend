import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateInfoTracerDto {
  @ApiProperty({example: 'Картой'})
  @IsString()
  name: string;
}