import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';
import { RolePermissions } from './entities/role-permissions.entity';
import { ModulesModule } from '../modules/modules.module';
import { PermissionsModule } from '../permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, RolePermissions]),
    ModulesModule,
    PermissionsModule,
  ],
  controllers: [RolesController],
  providers: [RolesService],
})
export class RolesModule {}
