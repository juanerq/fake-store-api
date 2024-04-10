import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RolePermissions } from '../../roles/entities/role-permissions.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('modules')
export class Module {
  @ApiProperty({
    uniqueItems: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    uniqueItems: true,
    required: true,
    example: 'products',
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @ApiProperty({
    uniqueItems: true,
    required: false,
    example: 'products',
  })
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
