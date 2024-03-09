import { Category } from 'src/context/categories/entities/category.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  title: string;

  @Column({
    type: 'text',
    default: '',
  })
  description: string;

  @Column({
    type: 'float',
    default: 0,
    nullable: false,
  })
  price: number;

  @Column({
    type: 'int',
    default: 0,
    nullable: false,
  })
  quantity: number;

  @Column({
    type: 'varchar',
    array: true,
    default: [],
  })
  images: string[];

  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'products_categories' })
  categories: Category[];

  @UpdateDateColumn()
  updatedAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
