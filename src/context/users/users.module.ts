import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { RolesModule } from '../security/roles/roles.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from '../security/auth/auth.module';
import { TypedEventEmitter } from 'src/common/events/events-emitter/typed-event-emitter.class';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    RolesModule,
    UtilsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService, TypedEventEmitter],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
