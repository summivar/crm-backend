import { Body, Controller, HttpStatus, Param, Post, Req, Res, UseGuards, } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { SignInDto, SignUpStuffDto, SignUpSuperManagerDto } from './dtos';
import { COOKIE_EXPIRES, COOKIE_KEY } from '../constants';
import { SignUpResponse, UserRequest } from './types';
import { Request, Response } from 'express';
import { JwtGuard } from './guards';
import { ApiErrorDecorator } from '../common/decorator/error';
import { EXCEPTION } from './exceptions';
import { ErrorEnum } from '../exceptions';

@ApiTags('Авторизация')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {
  }

  @ApiOperation({summary: 'Регистрация пользователя и новой компании'})
  @ApiErrorDecorator(EXCEPTION.ALREADY_EXISTS, ErrorEnum.BAD_REQUEST, HttpStatus.BAD_REQUEST)
  @ApiErrorDecorator(EXCEPTION.ALREADY_EXISTS, ErrorEnum.BAD_REQUEST, HttpStatus.BAD_REQUEST)
  @Post('signup')
  async signup(
    @Body() signupDto: SignUpSuperManagerDto,
    @Res({passthrough: true}) res: Response
  ): Promise<SignUpResponse> {
    const response = await this.authService.signupWithCompany(signupDto);

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    res.cookie(COOKIE_KEY.REFRESH_TOKEN, response.tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return {
      accessToken: response.tokens.accessToken,
      user: response.user
    };
  }

  @ApiOperation({summary: 'Регистрация работника компании'})
  @ApiParam({
    name: 'companySignupString',
    required: true,
    example: '78531390-d94f-4f8e-ae92-6aac9e181cd6',
    description: 'Ссылка подключения',
  })
  @Post('signup/:companySignupString')
  async signupStuff(
    @Body() signupDto: SignUpStuffDto,
    @Param('companySignupString') signupString: string,
    @Res({passthrough: true}) res: Response
  ): Promise<SignUpResponse> {
    const response = await this.authService.signupStuff(signupDto, signupString);

    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    res.cookie(COOKIE_KEY.REFRESH_TOKEN, response.tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return {
      accessToken: response.tokens.accessToken,
      user: response.user
    };
  }

  @ApiOperation({summary: 'Авторизация пользователя'})
  @Post('signin')
  async signin(
    @Body() signinDto: SignInDto,
    @Res({passthrough: true}) res: Response
  ) {
    const response = await this.authService.signin(signinDto);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    res.cookie(COOKIE_KEY.REFRESH_TOKEN, response.tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return {
      accessToken: response.tokens.accessToken,
      user: response.user
    };
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

  @ApiOperation({summary: 'Проверка авторизации'})
  @ApiBearerAuth('JWT-auth')
  @UseGuards(JwtGuard)
  @Post('getAuth')
  async getAuth(
    @Req() req: UserRequest,
    @Res({passthrough: true}) response: Response
  ) {
    console.log('user phone:', req.user.phone);
    console.log('user role:', req.user.role);
    console.log('user company:', req.user.company);
    return {
      phone: req.user.phone,
      role: req.user.role,
      company: req.user.company,
    }
  }

  @ApiOperation({summary: 'Обновление токенов'})
  @Post('refresh')
  async refreshTokens(
    @Req() request: Request,
    @Res({passthrough: true}) res: Response
  ) {
    const refreshToken = request.cookies[COOKIE_KEY.REFRESH_TOKEN];
    const response = await this.authService.refreshTokens(refreshToken);
    const expirationTime = new Date();
    expirationTime.setSeconds(expirationTime.getSeconds() + COOKIE_EXPIRES.REFRESH_TOKEN);
    res.cookie(COOKIE_KEY.REFRESH_TOKEN, response.tokens.refreshToken, {
      httpOnly: true,
      expires: expirationTime,
    });

    return {
      accessToken: response.tokens.accessToken,
      user: response.user
    };
  }

}
