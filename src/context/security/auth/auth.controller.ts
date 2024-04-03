import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

// Interfaces
import { CookiesAuth } from './interfaces';

// Dto
import { LoginUserDto, ValidateEmailDto } from './dto';
import {
  GenericResponseDto,
  RequestValidationResponseDto,
} from 'src/common/dto';

// Services
import { AuthService } from './auth.service';

// Decorators
import { Cookies } from 'src/common/decorators/cookies.decorator';
import { ApiCreatedGenericResponse } from 'src/common/decorators';
import {
  LoginResponseDto,
  RefreshTokenRespponseDto,
} from 'src/common/dto/login-response.dto';

@ApiTags('1. Autentication')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiCreatedGenericResponse({
    description: 'Successful login',
    dataDto: LoginResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Credentials are not valid',
    type: GenericResponseDto,
  })
  @Post('login')
  async loginUser(
    @Res({ passthrough: true }) res: FastifyReply,
    @Body() loginUserDto: LoginUserDto,
  ) {
    const { refreshToken, ...loginData } =
      await this.authService.login(loginUserDto);

    this.setCookie(res, 'refreshToken', refreshToken);

    return loginData;
  }

  @ApiInternalServerErrorResponse({
    description: 'Email not found in token',
    type: GenericResponseDto,
  })
  @ApiCreatedGenericResponse<any>({
    description: 'Email validated',
    resultType: 'string',
    dataDto: 'Email validated',
  })
  @Get('validate-email')
  validateEmail(@Query() validateEmailDto: ValidateEmailDto) {
    return this.authService.validateEmail(validateEmailDto);
  }

  @ApiCreatedGenericResponse({
    description: 'Token refresh successful',
    dataDto: RefreshTokenRespponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid Token',
    type: GenericResponseDto,
  })
  @Post('refresh-token')
  @HttpCode(200)
  async refresh(
    @Res({ passthrough: true }) res: FastifyReply,
    @Cookies('refreshToken') refreshToken: string,
  ) {
    const { newAccessToken: token, newRefreshToken } =
      await this.authService.refresh(refreshToken);

    this.setCookie(res, 'refreshToken', newRefreshToken);

    return {
      token,
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
