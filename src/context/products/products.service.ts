import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import {
  Between,
  ILike,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { FiltersProductsDto } from './dto/filter-product.dto';
import { PageMetaDto, PageDto } from 'src/common/dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    private readonly categoriesService: CategoriesService,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const { categories: categories_ids, ...productData } = createProductDto;
    const categories =
      await this.categoriesService.findAllByIds(categories_ids);

    const product = this.productRepository.create({
      ...productData,
      categories,
    });

    return await this.productRepository.save(product);
  }

  createWhereQuery(params: FiltersProductsDto) {
    const where: any = {};

    if (params.title) {
      where.title = ILike(`%${params.title}%`);
    }

    if (params.priceMax && params.priceMin) {
      where.price = Between(params.priceMin, params.priceMax);
    } else {
      if (params.priceMin) {
        where.price = MoreThanOrEqual(where.priceMin);
      }

      if (params.priceMax) {
        where.price = LessThanOrEqual(params.priceMax);
      }
    }

    if (params.categoryId) {
      where.categories = {
        id: params.categoryId,
      };
    }

    return where;
  }

  async findAll(filters: FiltersProductsDto): Promise<PageDto<Product>> {
    const {
      page,
      pageSize,
      orderBy = 'createdAt',
      sortOrder,
      ...where
    } = filters;

    const query = this.createWhereQuery(where);

    const [products, itemCount] = await this.productRepository.findAndCount({
      order: { [orderBy]: sortOrder },
      skip: (page - 1) * pageSize,
      take: pageSize,
      where: query,
      relations: { categories: true },
    });

    const pageMetaDto = new PageMetaDto({ pageOptionsDto: filters, itemCount });

    return new PageDto(products, pageMetaDto);
  }

  async findOne(id: number) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: { categories: true },
    });
    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    return product;
  }

  async findById(id: number) {
    const product = await this.productRepository.findOneBy({ id });
    if (!product) throw new NotFoundException(`Product with ${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { categories: categories_ids, ...productData } = updateProductDto;
    const product = await this.findById(id);

    let dataToUpdate = this.productRepository.merge(product, productData);

    if (categories_ids?.length) {
      const newCategories =
        await this.categoriesService.findAllByIds(categories_ids);
      if (newCategories.length)
        dataToUpdate = this.productRepository.merge(dataToUpdate, {
          categories: newCategories,
        });
    }

    const productToUpdate = this.productRepository.create(dataToUpdate);

    return await this.productRepository.save(productToUpdate);
  }

  async remove(id: number) {
    const product = await this.findById(id);

    await this.productRepository.remove(product);
  }
}
