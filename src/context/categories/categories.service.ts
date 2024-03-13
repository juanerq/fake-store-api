import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { In, Repository } from 'typeorm';
import { Utils } from 'src/utils/utils';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly utils: Utils,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return await this.categoryRepository.save(category);
  }

  async findAllByIds(ids: number[]) {
    const categories = await this.categoryRepository.findBy({ id: In(ids) });

    if (categories.length != ids.length) {
      this.utils.validateMissingRecordsById({
        records: categories,
        ids,
        notFoundException: true,
        customErrorMessage: {
          plural: 'Categories with ids (:id_list) not found',
          singular: 'Category with id (:id_list) not found',
        },
      });
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
