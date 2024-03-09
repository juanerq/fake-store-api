import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAllByIds(ids: number[]) {
    const categories = await this.categoryRepository.findBy({ id: In(ids) });

    if (categories.length != ids.length) {
      const rolesNotfound = ids.filter(
        (id) => !categories.some((rf) => id == rf.id),
      );
      if (rolesNotfound.length)
        throw new NotFoundException(
          `Category with id ${rolesNotfound.join(', ')} not found`,
        );
    }

    return categories;
  }

  async findAll() {
    return await this.categoryRepository.find();
  }

  async findOne(id: number) {
    const category = await this.categoryRepository.findOneBy({ id });
    if (!category) throw new NotFoundException(`Category with ${id} not found`);

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    const categoryToUpdate = this.categoryRepository.create(
      this.categoryRepository.merge(category, updateCategoryDto),
    );

    return await this.categoryRepository.save(categoryToUpdate);
  }

  async remove(id: number) {
    const category = await this.findOne(id);

    return await this.categoryRepository.remove(category);
  }
}
