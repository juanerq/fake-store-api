import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false,
  })
  name: string;

  @BeforeInsert()
  checkNameToInsert() {
    this.name = this.name.trim().toUpperCase();
  }

  @BeforeUpdate()
  checkNameToUpdate() {
    this.checkNameToInsert();
  }
}
