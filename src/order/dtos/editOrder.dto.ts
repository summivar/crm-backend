import { Client as ClientEnum } from '../../client/enums';
import { ArrayMinSize, ArrayNotEmpty, IsDateString, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditOrderDto {
  @ApiProperty({example: 'individualClient'})
  @IsString()
  @IsEnum(ClientEnum)
  @IsOptional()
  clientType: ClientEnum;

  @ApiProperty({example: 1})
  @IsNumber()
  @IsOptional()
  clientId: number;

  @ApiProperty({example: '2024-01-11T11:42:46+0000'})
  @IsDateString({
    strict: true,
    strictSeparator: true,
  })
  @IsOptional()
  orderDate: Date;

  @ApiProperty({example: 'г. Крутой, Ул. Советская, 21'})
  @IsString()
  @IsOptional()
  address: string;

  @ApiProperty({example: 5000.24})
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({example: 'Код от подъезда: 2456'})
  @IsString()
  @IsOptional()
  comment: string;

  @ApiProperty({example: 1})
  @IsNumber()
  @IsOptional()
  paymentMethodId: number;

  @ApiProperty({example: 1})
  @IsNumber()
  @IsOptional()
  statusId: number;

  @ApiProperty({example: [1, 2, 3]})
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, {each: true})
  @IsOptional()
  solutionsIds: number[];

  @ApiProperty({example: [1, 2, 3]})
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  @IsNumber({}, {each: true})
  @IsOptional()
  stuffIds: number[];
}