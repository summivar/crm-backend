import { IsHexColor, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditStatusDto {
  @ApiProperty({example: 'Готово'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: '#32a852'})
  @IsString()
  @IsHexColor()
  @IsOptional()
  color: string;
}