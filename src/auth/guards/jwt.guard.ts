import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from '../../user/user.service';
import { Payload } from '../types';
import { EXCEPTION } from '../exceptions';

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
        throw new UnauthorizedException(EXCEPTION.USER_IS_NOT_AUTHORIZED);
      }

      const payload: Payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('accessSecret'),
      });

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

      return true;
    } catch (e) {
      throw new UnauthorizedException(EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }
  }
}