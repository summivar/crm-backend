import { IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({example: 'Александр'})
  @IsString()
  name: string;

  @ApiProperty({example: 'Александров'})
  @IsString()
  surname: string;

  @ApiProperty({example: 'Александрович'})
  @IsString()
  middleName: string;

  @ApiProperty({example: '+79005553535'})
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({example: '12345678Aa'})
  @IsString()
  @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 0})
  password: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Фото',
    required: false,
  })
  photo: Express.Multer.File;
}