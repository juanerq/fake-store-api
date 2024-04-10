import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PermissionTypes } from '../enums/permission-types.enum';
import { RolePermissions } from '../../roles/entities/role-permissions.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('permissions')
export class Permission {
  @ApiProperty({
    uniqueItems: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    uniqueItems: true,
    example: 'CREATE',
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    enum: PermissionTypes,
    uniqueItems: true,
    example: PermissionTypes.POST,
  })
  @Column({
    type: 'enum',
    enum: PermissionTypes,
    unique: true,
    nullable: false,
  })
  type: PermissionTypes;

  @OneToMany(
    () => RolePermissions,
    (rolePermissions) => rolePermissions.permission,
  )
  rolePermissions: RolePermissions;

  @BeforeInsert()
  checkNameToInsert() {
    this.name = this.name.trim().toUpperCase();
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
