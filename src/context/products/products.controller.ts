import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpCode,
  Query,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';

// Entitys
import { Product } from './entities/product.entity';

// Services
import { ProductsService } from './products.service';

// Dto
import { GenericResponseDto } from 'src/common/dto';
import { RequestValidationResponseDto } from 'src/common/dto';
import { CreateProductDto, UpdateProductDto, FiltersProductsDto } from './dto';

// Decorators
import { Auth } from '../security/auth/decorators';
import {
  ApiCreatedGenericResponse,
  ApiPaginatedResponse,
} from 'src/common/decorators';

@ApiTags('3 Products')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'products' })
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiCreatedGenericResponse({
    dataDto: Product,
    status: HttpStatus.CREATED,
    description: 'Successfully created product',
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: GenericResponseDto,
  })
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @ApiPaginatedResponse({
    dataDto: Product,
    status: HttpStatus.OK,
  })
  @Get()
  findAll(@Query() filter: FiltersProductsDto) {
    return this.productsService.findAll(filter);
  }

  @ApiCreatedGenericResponse({
    dataDto: Product,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: GenericResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  @ApiCreatedGenericResponse({
    dataDto: Product,
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: GenericResponseDto,
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, updateProductDto);
  }

  @ApiNoContentResponse({
    description: 'Removed product',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: GenericResponseDto,
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }
}
