import { IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpStuffDto {
  @ApiProperty({example: 'Александр'})
  @IsString()
  name: string;

  @ApiProperty({example: '+79005553535'})
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({example: '12345678Aa'})
  @IsString()
  @IsStrongPassword({minLength: 8, minLowercase: 1, minUppercase: 1, minSymbols: 0})
  password: string;
}