import { ApiProperty } from '@nestjs/swagger';
import { Product } from 'src/context/products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('categories')
export class Category {
  @ApiProperty({
    uniqueItems: true,
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: 'varchar',
    required: true,
    uniqueItems: true,
    example: 'Gaming',
  })
  @Column({
    type: 'varchar',
    nullable: false,
    unique: true,
  })
  name: string;

  @ApiProperty({
    required: false,
    example:
      'http://api.fake-store/api/file/categories/fewkfjinkfmi03u0f94f3g4.png',
  })
  @Column({ type: 'varchar' })
  image: string;

  @ManyToMany(() => Product, (product) => product.categories)
  products: Product[];

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;
}
