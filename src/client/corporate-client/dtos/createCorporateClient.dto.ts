import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumber,
  IsNumberString,
  IsPhoneNumber,
  IsString
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCorporateClientDto {
  @ApiProperty({example: '+79005553535'})
  @IsString()
  @IsPhoneNumber('RU')
  phone: string;

  @ApiProperty({example: ['г.Владивосток, ул. Набережная, 21']})
  @IsArray()
  @ArrayMinSize(1)
  addresses: string[];

  @ApiProperty({ example: '2024-01-11T11:42:46+0000' })
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  dateOfCreation: Date;

  @ApiProperty({example: 'ООО КрутаяГрупп'})
  @IsString()
  name: string;

  @ApiProperty({example: 7727563778})
  @IsNumber()
  INN: number;

  @ApiProperty({example: 773301001})
  @IsNumber()
  KPP: number;
}