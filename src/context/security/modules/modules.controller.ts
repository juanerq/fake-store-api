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
  HttpStatus,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { Auth } from '../auth/decorators';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiCreatedGenericResponse } from 'src/common/decorators';
import {
  GenericResponseDto,
  RequestValidationResponseDto,
} from 'src/common/dto';
import { Module } from './entities/module.entity';

@ApiTags('4 Modules')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'modules' })
@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @ApiCreatedGenericResponse({
    dataDto: Module,
    status: HttpStatus.CREATED,
    description: 'Successfully created module',
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Post()
  create(@Body() createModuleDto: CreateModuleDto) {
    return this.modulesService.create(createModuleDto);
  }

  @ApiCreatedGenericResponse({
    dataDto: Module,
    resultType: 'array',
  })
  @Get()
  findAll() {
    return this.modulesService.findAll();
  }

  @ApiCreatedGenericResponse({
    dataDto: Module,
  })
  @ApiNotFoundResponse({
    description: 'Module not found',
    type: GenericResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.findOne(id);
  }

  @ApiCreatedGenericResponse({
    dataDto: Module,
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Module not found',
    type: GenericResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return this.modulesService.update(id, updateModuleDto);
  }

  @ApiNoContentResponse({
    description: 'Removed module',
  })
  @ApiNotFoundResponse({
    description: 'Module not found',
    type: GenericResponseDto,
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.modulesService.remove(id);
  }
}
