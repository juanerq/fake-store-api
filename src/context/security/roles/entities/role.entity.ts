import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePermissions } from './role-permissions.entity';
import { User } from '../../../users/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity('roles')
export class Role {
  @ApiProperty({
    type: 'number',
    example: 12,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: 'string',
    required: true,
    example: 'ADMIN',
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @OneToMany(() => RolePermissions, (rolePermissions) => rolePermissions.role)
  rolePermissions: RolePermissions[];

  @ManyToMany(() => User, (user) => user.roles)
  users: User[];

  @BeforeInsert()
  checkNameToInsert() {
    this.name = this.name.trim().toUpperCase();
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
