import { ArrayMinSize, IsArray, IsDateString, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditIndividualClientDto {
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
  birthday: Date;

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
}