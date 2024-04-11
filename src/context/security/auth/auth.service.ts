import {
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { LoginUserDto } from './dto/login-user.dto';
import { UsersService } from 'src/context/users/users.service';
import * as bcrypt from 'bcrypt';
import { RolesService } from '../roles/roles.service';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidateEmailDto } from './dto/validate-email.dto';
import { ConfigService } from '@nestjs/config';
import { TypedEventEmitter } from 'src/common/events/events-emitter/typed-event-emitter.class';
import { LoginResponseDto } from 'src/common/dto/login-response.dto';
import { ModulePermissions } from '../roles/dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly rolesService: RolesService,
    private readonly configService: ConfigService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<LoginResponseDto> {
    const { email, password } = loginUserDto;

    const user = await this.usersService.findUserAuth({ email });

    if (!user)
      throw new UnauthorizedException('Credentials are not valid (email)');

    const isValidPassword = this.comparePassword(password, user.password);

    if (!isValidPassword)
      throw new UnauthorizedException('Credentials are not valid (password)');

    const roles: ModulePermissions[] = [];

    if (user.roles) {
      for (const role of user.roles) {
        const { id } = role;
        const roleData = await this.rolesService.findOne(id);
        roles.push(roleData);
      }
    }

    delete user.password;

    const payload = {
      id: user.id,
      roles,
    };

    const accessToken = this.createAccessToken(payload);
    const refreshToken = this.createRefreshToken(payload);

    return {
      user,
      token: accessToken,
      refreshToken,
    };
  }

  async validateEmail(validateEmailDto: ValidateEmailDto) {
    const { token } = validateEmailDto;

    const payload = this.validateToken<{ email: string }>(token);

    if (!payload.email)
      throw new InternalServerErrorException('Email not found in token');

    const user = await this.usersService.activateUser({ email: payload.email });

    this.eventEmitter.emit('user.welcome', {
      email: payload.email,
      name: user.fullName,
    });

    return 'Email validated';
  }

  validateToken<T = JwtPayload>(token: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { iat, exp, ...payload } = this.jwtService.verify(token);
      if (!payload) throw new UnauthorizedException('Invalid Token');

      return payload as T;
    } catch (error) {
      throw new UnauthorizedException('Invalid Token');
    }
  }

  async refresh(oldRefreshToken: string) {
    const payload = this.validateToken(oldRefreshToken);

    const newRefreshToken = this.createRefreshToken(payload);
    const newAccessToken = this.createAccessToken(payload);

    return {
      newAccessToken,
      newRefreshToken,
    };
  }

  comparePassword(passportEntered: string, validPassword: string) {
    return bcrypt.compareSync(passportEntered, validPassword);
  }

  private createAccessToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }

  private createRefreshToken(payload: JwtPayload) {
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }

  getConfirmUrlToken({ email }: { email: string }) {
    const token = this.jwtService.sign({ email });

    return `${this.configService.get('WEBSERVICE_URL')}/auth/validate-email?token=${token}`;
  }
}
