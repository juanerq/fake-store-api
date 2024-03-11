import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Role } from './role.entity';
import { Module } from '../../modules/entities/module.entity';
import { Permission } from '../../permissions/entities/permission.entity';

@Entity('role_permissions')
@Unique(['role', 'module', 'permission'])
export class RolePermissions {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  roleId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  moduleId: number;

  @Column({
    type: 'int',
    nullable: false,
  })
  permissionId: number;

  @ManyToOne(() => Role, (role) => role.rolePermissions, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  role: Role;

  @ManyToOne(() => Module, (module) => module.rolePermissions, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  module: Module;

  @ManyToOne(() => Permission, (permission) => permission.rolePermissions, {
    cascade: true,
    onDelete: 'CASCADE',
    nullable: false,
  })
  permission: Permission;
}
