import { IsEnum, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums';

export class RoleUserDto {
  @ApiProperty({example: Role.MANAGER})
  @IsEnum(Role)
  @IsString()
  role: Role;
}