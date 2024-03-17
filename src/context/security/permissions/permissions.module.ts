import { Module, forwardRef } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { PermissionsController } from './permissions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Permission]),
    UtilsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [TypeOrmModule, PermissionsService],
})
export class PermissionsModule {}
