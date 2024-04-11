import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import {
  AddPermissionListDto,
  UpdateRoleDto,
  CreateRoleDto,
  ModulePermissions,
} from './dto';
import { RemovePermissionsRoleDto } from './dto/remove-permissions-role.dto';
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
import { Role, RolePermissions } from './entities';

@ApiTags('6 Roles')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'roles' })
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @ApiCreatedGenericResponse({
    dataDto: Role,
    status: HttpStatus.CREATED,
    description: 'Successfully created role',
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @ApiCreatedGenericResponse({
    status: HttpStatus.CREATED,
    dataDto: RolePermissions,
    resultType: 'array',
  })
  @ApiNotFoundResponse({
    description: 'Role, module or permission not found',
    type: GenericResponseDto,
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @Post('/permissions/:id')
  addPermissionsList(
    @Param('id', ParseIntPipe) id: number,
    @Body() addPermissionListDto: AddPermissionListDto,
  ) {
    return this.rolesService.addPermissionsList(id, addPermissionListDto);
  }

  @ApiCreatedGenericResponse({
    dataDto: Role,
    resultType: 'array',
  })
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @ApiCreatedGenericResponse({
    dataDto: ModulePermissions,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: GenericResponseDto,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @ApiCreatedGenericResponse({
    dataDto: Role,
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: GenericResponseDto,
  })
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @ApiNoContentResponse({
    description: 'Removed role',
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: GenericResponseDto,
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }

  @ApiNoContentResponse({
    description: 'Removed permissions',
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: GenericResponseDto,
  })
  @Delete('/permissions/:id')
  @HttpCode(204)
  removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Query() removePermissionsRoleDto: RemovePermissionsRoleDto,
  ) {
    return this.rolesService.removePermission(id, removePermissionsRoleDto);
  }
}
