import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePermissions } from '../../roles/entities/role-permissions.entity';

@Entity('modules')
export class Module {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  detail: string;

  @OneToMany(() => RolePermissions, (rolePermissions) => rolePermissions.module)
  rolePermissions: RolePermissions;

  @BeforeInsert()
  checkNameToInsert() {
    if (!this.detail) this.detail = this.name;

    this.detail = this.detail.trim().toLowerCase().replaceAll(' ', '-');
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
