import { Role } from '../entities';
import { Permission } from '../../permissions/entities/permission.entity';
import { Module } from '../../modules/entities/module.entity';

export interface ModulePermissions {
  role: Role;
  modulePermissions: {
    module: Module;
    permissions: Permission[];
  }[];
}
