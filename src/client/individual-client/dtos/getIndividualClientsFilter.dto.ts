import { ApiProperty } from '@nestjs/swagger';
import { IsBooleanString, IsDateString, IsNumberString, IsOptional } from 'class-validator';

export class GetIndividualClientsFilterDto {
  @ApiProperty({required: false })
  @IsDateString()
  @IsOptional()
  dateFrom?: Date;

  @ApiProperty({required: false })
  @IsDateString()
  @IsOptional()
  dateTo?: string;

  @ApiProperty({required: false})
  @IsBooleanString()
  @IsOptional()
  someAddresses: string;

  @ApiProperty({required: false})
  @IsNumberString()
  @IsOptional()
  infoTracerId: string;
}