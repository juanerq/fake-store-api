import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from '../../security/roles/entities';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty({
    type: 'number',
    example: 1,
    uniqueItems: true,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'Test Fake Store',
    required: true,
  })
  @Column({
    type: 'varchar',
    nullable: false,
  })
  fullName: string;

  @ApiProperty({
    example: 'test123@gmail.com',
    uniqueItems: true,
    required: true,
  })
  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
  })
  password: string;

  @ApiProperty({
    default: false,
  })
  @Column({
    type: 'bool',
    default: false,
    nullable: false,
  })
  isActive: boolean;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({
    type: () => [Role],
  })
  @ManyToMany(() => Role, (role) => role.users, {
    cascade: true,
  })
  @JoinTable({ name: 'users_roles' })
  roles: Role[];

  @BeforeInsert()
  checkFieldBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldBeforeUpdate() {
    this.checkFieldBeforeInsert();
  }
}
