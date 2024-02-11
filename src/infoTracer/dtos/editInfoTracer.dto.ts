import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditInfoTracerDto {
  @ApiProperty({example: 'Картой'})
  @IsString()
  @IsOptional()
  name: string;
}