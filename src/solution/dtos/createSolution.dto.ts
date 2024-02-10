import { IsIn, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSolutionDto {
  @ApiProperty({example: 'Уборка'})
  @IsString()
  name: string;

  @ApiProperty({example: 500})
  @IsNumber()
  price: number;

  @ApiProperty({example: 300})
  @IsNumber()
  costPrice: number;

  @ApiProperty({example: 1})
  @IsIn([1, 2, 3], {message: 'Difficulty must be 1, 2, or 3'})
  difficulty: number;

  @ApiProperty({example: 'Tutu', required: false})
  @IsString()
  comment: string;
}