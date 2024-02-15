import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { UserService } from '../../user/user.service';
import { Payload } from '../types';
import { ConfigService } from '@nestjs/config';
import { EXCEPTION } from '../exceptions';

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
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()]
    );

    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    let bearer: string, token: string = '';
    try {
      bearer = authHeader.split(' ')[0];
      token = authHeader.split(' ')[1];
    } catch (e) {
      throw new UnauthorizedException(EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }


    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException(EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }

    if (!requiredRoles) {
      return true;
    }

    let payload: Payload = {};

    try {
      payload = await this.jwtService.verifyAsync(token, {secret: this.configService.get<string>('accessSecret')});
    } catch (e) {
      throw new UnauthorizedException(EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }


    const user = await this.userService.getUserByPhone(payload.phone);

    if (!user) {
      throw new UnauthorizedException(EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }

    req.user = {
      id: user.id,
      phone: user.phone,
      role: user.role,
      company: user.company.id
    };

    if (!requiredRoles.includes(user.role)) {
      throw new ForbiddenException(EXCEPTION.NOT_RULES_FOR);
    }

    return true;
  }
}