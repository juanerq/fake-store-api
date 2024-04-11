import { Role } from '../entities';
import { Permission } from '../../permissions/entities/permission.entity';
import { Module } from '../../modules/entities/module.entity';
import { ApiProperty } from '@nestjs/swagger';

export class ModulePermissions {
  @ApiProperty({
    type: () => Role,
  })
  role: Role;

  @ApiProperty({
    type: () => [RolePermissionsDto],
  })
  modulePermissions: RolePermissionsDto[];
}

class RolePermissionsDto {
  @ApiProperty({
    type: () => Module,
  })
  module: Module;

  @ApiProperty({
    type: () => [Permission],
  })
  permissions: Permission[];
}
