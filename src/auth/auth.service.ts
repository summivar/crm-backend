import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { SignInDto, SignUpStuffDto, SignUpSuperManagerDto } from './dtos';
import { User } from '../user/entities/user.entity';
import { EntityManager } from 'typeorm';
import { Company } from '../company/entities/company.entity';
import { Role } from './enums';
import { UserService } from '../user/user.service';
import { COOKIE_EXPIRES, EXCEPTION_MESSAGE } from '../constants';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Tokens } from './types';
import { CompanyService } from '../company/company.service';
import { CryptService } from 'src/common/crypt/crypt.service';
import { EXCEPTION } from './exceptions';

// import { Confirm } from './entities/confirm.entity';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(Confirm) private readonly confirmRepository: Repository<Confirm>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService,
  ) {
  }

  async sendCode() {
    const code = this.getCode();

  }

  // async confirmCode(writtenCode: string, encryptedString: string) {
  //   const id = CryptService.decryptConfirm(encryptedString);
  //   const confirm = await this.confirmRepository.findOne({
  //     where: {
  //       id: id
  //     }
  //   });
  //   if (!confirm) {
  //     throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('confirm'));
  //   }
  //
  //   if (writtenCode !== confirm.code) {
  //     throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.CONFIRM_CODE_WRONG);
  //   }
  //
  //   await this.confirmRepository.delete(confirm);
  //
  //   return true;
  // }

  async signupWithCompany(dto: SignUpSuperManagerDto) {
    const candidate = await this.userService.getUserByPhone(dto.phone);
    if (candidate) {
      throw new BadRequestException(EXCEPTION.ALREADY_EXISTS);
    }

    const tokens = await this.getToken(dto.phone);

    const user = new User({
      name: dto.name,
      photoPath: null,
      phone: dto.phone,
      password: dto.password,
      refreshToken: tokens.refreshToken,
      role: Role.ADMIN
    });

    const newUser = await this.userService.save(user);

    const company = new Company({
      users: [newUser]
    });

    const newCompany = await this.companyService.save(company);

    newCompany.signUpManagerString = CryptService.encryptRole(newCompany.id, Role.MANAGER);
    newCompany.signUpDriverString = CryptService.encryptRole(newCompany.id, Role.DRIVER);
    newCompany.signUpCleanerString = CryptService.encryptRole(newCompany.id, Role.CLEANER);

    await this.companyService.save(newCompany);

    return {
      tokens,
      user: {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role
      }
    };
  }

  async signupStuff(dto: SignUpStuffDto, signupString: string) {
    const candidate = await this.userService.getUserByPhone(dto.phone);
    if (candidate) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
    }

    let data = null;
    try {
      data = CryptService.decryptRole(signupString);
    } catch (e) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const company = await this.companyService.getCompanyById(data?.id);
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const tokens = await this.getToken(dto.phone);

    const user = new User({
      name: dto.name,
      photoPath: null,
      phone: dto.phone,
      password: dto.password,
      refreshToken: tokens.refreshToken,
      role: data.role,
      company: company
    });

    const newUser = await this.userService.save(user);

    company.users.push(newUser);

    await this.entityManager.save(company);

    return {
      tokens,
      user: {
        id: newUser.id,
        name: newUser.name,
        role: newUser.role
      }
    };
  }

  async signin(dto: SignInDto) {
    const candidate = await this.userService.getUserByPhone(dto.phone);
    if (!candidate) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.INVALID_CREDENTIALS);
    }

    const passwordMatches = await argon.verify(candidate.password, dto.password);
    if (!passwordMatches) {
      throw new UnauthorizedException(EXCEPTION_MESSAGE.UNAUTHORIZED_EXCEPTION.INVALID_CREDENTIALS);
    }

    const tokens = await this.getToken(candidate.phone);
    await this.userService.updateRefreshToken(candidate.phone, tokens.refreshToken);

    return {
      tokens,
      user: {
        id: candidate.id,
        name: candidate.name,
        role: candidate.role
      }
    };
  }

  async logout(phone: string) {
    await this.userService.updateRefreshToken(phone, 'null');
    return this.companyService.getCompanyById(1);
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

    return {
      tokens,
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    };
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

  private getCode(): string {
    return (Math.floor(100000 + Math.random() * 900000)).toString();
  }
}
