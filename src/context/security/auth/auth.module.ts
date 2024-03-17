import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfigService } from 'src/config/auth/jwt/jwt.config';
import { RolesModule } from '../roles/roles.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersModule } from 'src/context/users/users.module';
import { EmailModule } from 'src/context/email/email.module';
import { TypedEventEmitter } from 'src/common/events/events-emitter/typed-event-emitter.class';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useClass: JwtConfigService,
    }),
    RolesModule,
    forwardRef(() => UsersModule),
    EmailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, TypedEventEmitter],
  exports: [JwtStrategy, PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
