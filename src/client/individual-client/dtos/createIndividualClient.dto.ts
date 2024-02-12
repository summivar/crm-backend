import { ArrayMinSize, IsArray, IsDateString, IsNumber, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateIndividualClientDto {
  @ApiProperty({example: 1})
  @IsNumber()
  infoTracerId: number;

  @ApiProperty({example: '+79005553535'})
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({example: ['г.Владивосток, ул. Набережная, 21']})
  @IsArray()
  @ArrayMinSize(1)
  addresses: string[];

  @ApiProperty({example: '2024-01-11T11:42:46+0000'})
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  birthday: Date;

  @ApiProperty({example: 'Александр'})
  @IsString()
  name: string;

  @ApiProperty({example: 'Александров'})
  @IsString()
  surname: string;

  @ApiProperty({example: 'Александрович'})
  @IsString()
  middleName: string;
}