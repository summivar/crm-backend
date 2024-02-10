import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditSolutionDto {
  @ApiProperty({example: 'Уборка', required: false})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 500, required: false})
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({example: 300, required: false})
  @IsNumber()
  @IsOptional()
  costPrice: number;

  @ApiProperty({example: 1, required: false})
  @IsIn([1, 2, 3], {message: 'Difficulty must be 1, 2, or 3'})
  @IsOptional()
  difficulty: number;

  @ApiProperty({example: 'Tutu', required: false})
  @IsString()
  @IsOptional()
  comment: string;
}