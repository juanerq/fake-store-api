import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';

// Dto
import {
  GenericResponseDto,
  RequestValidationResponseDto,
} from 'src/common/dto';
import { CreateCategoryDto, UpdateCategoryDto } from './dto';

// Services
import { CategoriesService } from './categories.service';

// Decorators
import { Auth } from '../security/auth/decorators';
import { ApiCreatedGenericResponse } from 'src/common/decorators';
import { Category } from './entities/category.entity';

@ApiTags('2 Categories')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'categories' })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiCreatedGenericResponse({
    dataDto: Category,
    status: HttpStatus.CREATED,
    description: 'Successfully created category',
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Post()
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @ApiCreatedGenericResponse({
    dataDto: Category,
    resultType: 'array',
  })
  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @ApiCreatedGenericResponse({
    dataDto: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: GenericResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }

  @ApiCreatedGenericResponse({
    dataDto: Category,
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: GenericResponseDto,
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @ApiNoContentResponse({
    description: 'Removed category',
  })
  @ApiNotFoundResponse({
    description: 'Category not found',
    type: GenericResponseDto,
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
