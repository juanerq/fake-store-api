import { Module, forwardRef } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolePermissions } from './entities/role-permissions.entity';
import { ModulesModule } from '../modules/modules.module';
import { PermissionsModule } from '../permissions/permissions.module';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermissions]),
    ModulesModule,
    PermissionsModule,
    UtilsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
