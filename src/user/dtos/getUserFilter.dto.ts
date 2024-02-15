import { Role } from '../../auth/enums';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';

export class GetUserFilterDto {
  @ApiProperty({example: Role.MANAGER})
  @IsEnum(Role)
  @IsString()
  @IsOptional()
  role?: Role
}