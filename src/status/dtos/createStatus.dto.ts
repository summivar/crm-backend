import { IsHexColor, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatusDto {
  @ApiProperty({example: 'Готово'})
  @IsString()
  name: string;

  @ApiProperty({example: '#32a852'})
  @IsString()
  @IsHexColor()
  color: string;
}