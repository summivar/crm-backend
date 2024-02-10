import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { EXCEPTION_MESSAGE } from '../../constants';
import { UserService } from '../../user/user.service';
import { Payload } from '../types/payload.type';
import { ConfigService } from '@nestjs/config';
import { Role } from '../enums';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
    private jwtService: JwtService,
    private reflector: Reflector
  ) {
  }

  async canActivate(
    context: ExecutionContext
  ): Promise<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()]
      );

      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
      }

      if (!requiredRoles) {
        return true;
      }

      const payload: Payload = await this.jwtService.verifyAsync(token, {secret: this.configService.get<string>('accessSecret')});

      const user = await this.userService.getUserByPhone(payload.phone);

      if (!user) {
        throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
      }

      req.user = {
        id: user.id,
        phone: user.phone,
        role: user.role,
        company: user.company.id
      };

      return requiredRoles.includes(user.role);
    } catch (e) {
      throw new ForbiddenException(EXCEPTION_MESSAGE.FORBIDDEN_EXCEPTION.NO_RULES_TO_GET);
    }
  }
}