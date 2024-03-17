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
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { AddPermissionListDto, UpdateRoleDto, CreateRoleDto } from './dto';
import { RemovePermissionsRoleDto } from './dto/remove-permissions-role.dto';
import { Auth } from '../auth/decorators';

@Auth({ moduleName: 'roles' })
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Post('/permissions/:id')
  addPermissionsList(
    @Param('id', ParseIntPipe) id: number,
    @Body() addPermissionListDto: AddPermissionListDto,
  ) {
    return this.rolesService.addPermissionsList(id, addPermissionListDto);
  }

  @Get()
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.rolesService.remove(id);
  }

  @Delete('/permissions/:id')
  @HttpCode(204)
  removePermissions(
    @Param('id', ParseIntPipe) id: number,
    @Query() removePermissionsRoleDto: RemovePermissionsRoleDto,
  ) {
    return this.rolesService.removePermission(id, removePermissionsRoleDto);
  }
}
