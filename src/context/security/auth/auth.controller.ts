import { Controller, Post, Body, Get, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dt';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { FastifyReply } from 'fastify';
import { CookiesAuth } from './interfaces';
import { Cookies } from 'src/common/decorators/cookies.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { token, refreshToken, user } =
      await this.authService.login(loginUserDto);

    this.setCookie(res, 'refreshToken', refreshToken);

    return {
      ...user,
      token,
    };
  }

  @Get('validate-email')
  validateEmail(@Query() validateEmailDto: ValidateEmailDto) {
    return this.authService.validateEmail(validateEmailDto);
  }

  @Post('refresh-token')
  async refresh(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const { newAccessToken, newRefreshToken } =
      await this.authService.refresh(refreshToken);

    this.setCookie(res, 'refreshToken', newRefreshToken);

    return {
      token: newAccessToken,
    };
  }

  private setCookie(res: FastifyReply, name: keyof CookiesAuth, value: string) {
    res.setCookie(name, value, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
  }
}
