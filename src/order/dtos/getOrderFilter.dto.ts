import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator';
import { Client as ClientEnum } from '../../client/enums';

export class GetOrdersFilterDto {
  @ApiProperty({required: false })
  @IsString()
  @IsEnum(ClientEnum)
  @IsOptional()
  clientType?: ClientEnum;

  @ApiProperty({required: false})
  @IsNumberString()
  @IsOptional()
  clientId: number;

  @ApiProperty({required: false})
  @IsNumberString()
  @IsOptional()
  managerId: number;

  @ApiProperty({required: false })
  @IsNumberString()
  @IsOptional()
  statusId?: number;

  @ApiProperty({required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: Date;

  @ApiProperty({required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: Date;

  @ApiProperty({required: false })
  @IsNumberString({}, { each: true })
  @IsOptional()
  solutionIds?: number[];

  @ApiProperty({required: false })
  @IsNumberString({}, { each: true })
  @IsOptional()
  stuffIds?: number[];

  @ApiProperty({required: false })
  @IsNumberString()
  @IsOptional()
  priceFrom?: number;

  @ApiProperty({required: false })
  @IsNumberString()
  @IsOptional()
  priceTo?: number;

  @ApiProperty({required: false })
  @IsNumberString()
  @IsOptional()
  paymentMethodId?: number;
}
