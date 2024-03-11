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

@Entity('permissions')
export class Permission {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

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
