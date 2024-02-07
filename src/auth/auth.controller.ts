import {
  Body,
  Controller,
  Param,
  ParseEnumPipe,
  Post,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpStuffDto, SignUpSuperManagerDto } from './dtos';
import { FileInterceptor } from '@nestjs/platform-express';
import { COOKIE_EXPIRES, COOKIE_KEY, FILE_LIMIT } from '../constants';
import { ValidationException } from '../exceptions';
import { extname } from 'path';
import { UserRequest } from './types';
import { Request, Response } from 'express';
import { JwtGuard } from './guards';
import { Role, Worker } from './enums';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @ApiOperation({summary: 'Регистрация пользователя и новой компании'})
  @Post('signup')
  async signup(
    @Body() signupDto: SignUpSuperManagerDto,
    @Res({passthrough: true}) response: Response
  ) {
    const tokens = await this.authService.signupWithCompany(signupDto);

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }

  @ApiOperation({summary: 'Регистрация работника компании'})
  @ApiParam({
    name: 'companySignupString',
    required: true,
    example: '78531390-d94f-4f8e-ae92-6aac9e181cd6',
    description: 'Ссылка подключения',
  })
  @ApiParam({
    name: 'role',
    required: true,
    example: Role.CLEANER,
    description: 'Роль пользователя',
  })
  @Post('signup/:companySignupString/:role')
  async signupStuff(
    @Body() signupDto: SignUpStuffDto,
    @Param('companySignupString') signupString: string,
    @Param('role', new ParseEnumPipe(Worker)) role: Role,
    @Res({passthrough: true}) response: Response
  ) {
    const tokens = await this.authService.signupStuff(signupDto, signupString, role);

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }

  @ApiOperation({summary: 'Авторизация пользователя'})
  @Post('signin')
  async signin(
    @Body() signinDto: SignInDto,
    @Res({passthrough: true}) response: Response
  ) {
    const tokens = await this.authService.signin(signinDto);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }

  @ApiOperation({summary: 'Выход из аккаунта'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(
    @Req() req: UserRequest,
    @Res({passthrough: true}) response: Response
  ) {
    response.clearCookie(COOKIE_KEY.REFRESH_TOKEN);
    return this.authService.logout(req.user.phone);
  }

  @ApiOperation({summary: 'Обновление токенов'})
  @Post('refresh')
  async refreshTokens(
    @Req() request: Request,
    @Res({passthrough: true}) response: Response
  ) {
    const refreshToken = request.cookies[COOKIE_KEY.REFRESH_TOKEN];
    const tokens = await this.authService.refreshTokens(refreshToken);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    response.cookie(COOKIE_KEY.REFRESH_TOKEN, tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return tokens.accessToken;
  }

}