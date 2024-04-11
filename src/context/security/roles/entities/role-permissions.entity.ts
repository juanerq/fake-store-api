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
import { ApiProperty } from '@nestjs/swagger';

@Entity('role_permissions')
@Unique(['role', 'module', 'permission'])
export class RolePermissions {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 3,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  roleId: number;

  @ApiProperty({
    example: 2,
  })
  @Column({
    type: 'int',
    nullable: false,
  })
  moduleId: number;

  @ApiProperty({
    example: 3,
  })
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
