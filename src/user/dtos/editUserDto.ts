import { IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({example: 'Александр', required: false})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 'Александров', required: false})
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty({example: 'Александрович', required: false})
  @IsString()
  middleName: string;

  @ApiProperty({example: '+79005553535', required: false})
  @IsString()
  @IsPhoneNumber('RU')
  @IsOptional()
  phone: string;

  @ApiProperty({example: '12345678Aa', required: false})
  @IsString()
  @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 0})
  @IsOptional()
  password: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото',
    required: false,
  })
  @IsOptional()
  photo: Express.Multer.File;
}