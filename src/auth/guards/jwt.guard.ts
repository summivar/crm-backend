import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EXCEPTION_MESSAGE } from '../../constants';
import { UserService } from '../../user/user.service';
import { Payload } from '../types/payload.type';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private jwtService: JwtService, private configService: ConfigService, private userService: UserService) {
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];

      if (bearer !== 'Bearer' || !token) {
        throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
      }

      const payload : Payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('accessSecret'),
      });

      const user = await this.userService.getUserByPhone(payload.phone);

      if (!user) {
        throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
      }

      req.user = payload.phone;

      return true;
    } catch (e) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }
  }
}