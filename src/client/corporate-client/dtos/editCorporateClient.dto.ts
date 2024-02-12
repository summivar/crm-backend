import { ArrayMinSize, IsArray, IsDateString, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditCorporateClientDto {
  @ApiProperty({example: 1})
  @IsNumber()
  infoTracerId: number;

  @ApiProperty({example: '+79005553535'})
  @IsString()
  @IsPhoneNumber('RU')
  @IsOptional()
  phone: string;

  @ApiProperty({example: ['г.Владивосток, ул. Набережная, 21']})
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  addresses: string[];

  @ApiProperty({example: '2024-01-11T11:42:46+0000'})
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @IsOptional()
  dateOfCreation: Date;

  @ApiProperty({example: 'ООО КрутаяГрупп'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: '7727563778'})
  @IsString()
  @IsOptional()
  INN: string;

  @ApiProperty({example: '773301001'})
  @IsString()
  @IsOptional()
  KPP: string;
}