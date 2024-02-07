import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpStuffDto, SignUpSuperManagerDto } from './dtos';
import { User } from '../user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { FileSystemService } from '../common/file-system/file-system.service';
import { Role, Worker } from './enums';
import { UserService } from '../user/user.service';
import { COOKIE_EXPIRES, EXCEPTION_MESSAGE, FILENAME } from '../constants';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';
import { CompanyService } from '../company/company.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly fileService: FileSystemService,
    private readonly companyService: CompanyService,
  ) {
  }

  async signupWithCompany(dto: SignUpSuperManagerDto) {
    const candidate = await this.userService.getUserByPhone(dto.phone);
    if (candidate) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const tokens = await this.getToken(dto.phone);

    const user = new User({
      name: dto.name,
      photoPath: FILENAME.DEFAULT_IMG,
      phone: dto.phone,
      password: dto.password,
      refreshToken: tokens.refreshToken,
      role: Role.SUPERMANAGER
    });

    const company = new Company({
      users: [user]
    });

    await this.entityManager.save(company);

    return tokens;
  }

  async signupStuff(dto: SignUpStuffDto, signupString: string, role: Role) {
    const candidate = await this.userService.getUserByPhone(dto.phone);
    if (candidate) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    const company = await this.companyService.getCompanyBySignupId(signupString);
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const tokens = await this.getToken(dto.phone);

    const user = new User({
      name: dto.name,
      photoPath: FILENAME.DEFAULT_IMG,
      phone: dto.phone,
      password: dto.password,
      refreshToken: tokens.refreshToken,
      role: role,
      company: company
    });

    company.users.push(user);

    await this.entityManager.save(company);

    return tokens;
  }

  async signin(dto: SignInDto) {
    const candidate = await this.userService.getUserByPhone(dto.phone);
    if (!candidate) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.INVALID_CREDENTIALS);
    }

    const passwordMatches = await bcrypt.compare(dto.password, candidate.password);

    if (!passwordMatches) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.INVALID_CREDENTIALS);
    }

    const tokens = await this.getToken(candidate.phone);
    await this.userService.updateRefreshToken(candidate.phone, tokens.refreshToken);

    return tokens;
  }

  async logout(phone: string) {
    return this.userService.updateRefreshToken(phone, 'null');
  }

  async refreshTokens(refreshToken: string) {
    let isExpired: boolean = false;
    try {
      await this.jwtService.verifyAsync(refreshToken, {secret: this.configService.get<string>('refreshSecret')});
    } catch (e) {
      isExpired = true;
    }

    if (!refreshToken || isExpired) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }

    const user = await this.userService.findByRefreshToken(refreshToken);

    if (!user) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.USER_IS_NOT_AUTHORIZED);
    }

    const tokens = await this.getToken(user.phone);
    await this.userService.updateRefreshToken(user.phone, tokens.refreshToken);

    return tokens;
  }


  private async getToken(phone: string): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync({
          phone: phone,
        },
        {
          secret: this.configService.get<string>('accessSecret'),
          expiresIn: COOKIE_EXPIRES.ACCESS_TOKEN,
        },
      ),
      this.jwtService.signAsync({
          phone: phone,
        },
        {
          secret: this.configService.get<string>('refreshSecret'),
          expiresIn: COOKIE_EXPIRES.REFRESH_TOKEN,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
