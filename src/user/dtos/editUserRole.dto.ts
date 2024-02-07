import { IsEnum, IsOptional, IsPhoneNumber, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../../auth/enums';

export class EditUserRoleDto {
  @IsEnum(Role)
  @IsString()
  role: Role;
}