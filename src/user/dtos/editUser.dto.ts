import { IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditUserDto {
  @ApiProperty({example: 'Александр'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 'Александров'})
  @IsString()
  @IsOptional()
  surname: string;

  @ApiProperty({example: 'Александрович'})
  @IsString()
  @IsOptional()
  middleName: string;

  @ApiProperty({example: '+79005553535'})
  @IsString()
  @IsPhoneNumber('RU')
  @IsOptional()
  phone: string;

  @ApiProperty({example: '12345678Aa'})
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