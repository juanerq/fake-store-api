import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty({
    uniqueItems: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    uniqueItems: true,
    required: false,
    example: 'Video Game Console',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  title: string;

  @ApiProperty({
    default: '',
    required: true,
  })
  @Column({
    type: 'text',
    default: '',
  })
  description: string;

  @ApiProperty({
    type: 'float',
    default: 0,
    required: false,
  })
  @Column({
    type: 'float',
    default: 0,
    nullable: false,
  })
  price: number;

  @ApiProperty({
    type: 'int',
    default: 0,
    required: false,
  })
  @Column()
  quantity: number;

  @ApiProperty({
    type: () => [String],
    default: [],
    isArray: true,
    example:
      'http://api.fake-store/api/file/products/fkn32ofoFFfwofnwin903b.png',
  })
  @Column({
    type: 'varchar',
    array: true,
    default: [],
  })
  images: string[];

  @ApiProperty({
    type: [Category],
  })
  @ManyToMany(() => Category, (category) => category.products)
  @JoinTable({ name: 'products_categories' })
  categories: Category[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
