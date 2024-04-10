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
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
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
import { Permission } from './entities/permission.entity';
import { PermissionTypes } from './enums/permission-types.enum';

@ApiTags('5 Permissions')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'permissions' })
@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @ApiCreatedGenericResponse({
    dataDto: Permission,
    status: HttpStatus.CREATED,
    description: 'Successfully created permission',
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto) {
    return this.permissionsService.create(createPermissionDto);
  }

  @ApiCreatedGenericResponse({
    dataDto: Permission,
    resultType: 'array',
  })
  @Get()
  findAll() {
    return this.permissionsService.findAll();
  }

  @ApiCreatedGenericResponse<any>({
    dataDto: Object.values(PermissionTypes),
    resultType: 'any',
  })
  @Get('types')
  getPermissionTypes() {
    return this.permissionsService.getPermissionTypes();
  }

  @ApiCreatedGenericResponse({
    dataDto: Permission,
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    type: GenericResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.findOne(id);
  }

  @ApiCreatedGenericResponse({
    dataDto: Permission,
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    type: GenericResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePermissionDto: UpdatePermissionDto,
  ) {
    return this.permissionsService.update(id, updatePermissionDto);
  }

  @ApiNoContentResponse({
    description: 'Removed permission',
  })
  @ApiNotFoundResponse({
    description: 'Permission not found',
    type: GenericResponseDto,
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.permissionsService.remove(id);
  }
}
