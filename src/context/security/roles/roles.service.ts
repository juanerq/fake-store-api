import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { AddPermissionListDto, CreateRoleDto, UpdateRoleDto } from './dto';
import { ModulesService } from '../modules/modules.service';
import { PermissionsService } from '../permissions/permissions.service';
import { RolePermissions } from './entities';
import { Module } from '../modules/entities/module.entity';
import { Permission } from '../permissions/entities/permission.entity';
import { RemovePermissionsRoleDto } from './dto/remove-permissions-role.dto';
import { Utils } from 'src/utils/utils';
import { ModulePermissions } from './dto/module-permissions.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermissions)
    private readonly rolePermissionsRepository: Repository<RolePermissions>,
    private readonly modulesServices: ModulesService,
    private readonly permissionsServices: PermissionsService,
    private readonly utils: Utils,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findByIds(
    ids: number[],
    options: { validateList: boolean } = { validateList: false },
  ) {
    const { validateList } = options;

    const roles = await this.roleRepository.find({
      where: { id: In(ids) },
    });

    this.utils.validateMissingRecordsById({
      records: roles,
      ids,
      notFoundException: validateList,
      customErrorMessage: {
        plural: 'Roles with ids (:id_list) not found',
        singular: 'Role with id (:id_list) not found',
      },
    });

    return roles;
  }

  async findOneSimple(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOneSimple(id);

    const roleToUpdate = this.roleRepository.create(
      this.roleRepository.merge(role, updateRoleDto),
    );

    return await this.roleRepository.save(roleToUpdate);
  }

  async remove(id: number) {
    const role = await this.findOneSimple(id);
    await this.roleRepository.remove(role);
  }

  async findOne(id: number): Promise<ModulePermissions> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: {
        rolePermissions: true,
      },
    });

    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    const { rolePermissions, ...roleData } = role;

    const groupedPermissions = rolePermissions.reduce((ac, cv) => {
      if (!ac[cv.moduleId]) ac[cv.moduleId] = {};
      ac[cv.moduleId][cv.permissionId] = true;

      return ac;
    }, {}) as { [k in number]: Record<number, true> };

    const moduleIds = [...new Set(rolePermissions.map((e) => e.moduleId))];
    const permissionIds = [
      ...new Set(rolePermissions.map((e) => e.permissionId)),
    ];

    const moduleList = await this.modulesServices.findByIds(moduleIds);
    const permissionList =
      await this.permissionsServices.findByIds(permissionIds);

    const modulePermissions = Object.entries(groupedPermissions).reduce(
      (ac, cv) => {
        const [key, value] = cv;
        const module = moduleList.find((m) => m.id === +key);
        const permissions = permissionList.filter((p) => p.id in value);

        return [...ac, { module, permissions }];
      },
      [],
    ) as Array<{ module: Module; permissions: Permission[] }>;

    return { role: roleData as Role, modulePermissions };
  }

  async addPermissionsList(
    id: number,
    addPermissionListDto: AddPermissionListDto,
  ) {
    const { permissions } = addPermissionListDto;

    const { moduleIds, permissionIds } = permissions.reduce(
      (ac, cv) => ({
        moduleIds: [...ac.moduleIds, cv.moduleId],
        permissionIds: [...ac.permissionIds, cv.permissionId],
      }),
      { moduleIds: [], permissionIds: [] },
    ) as { moduleIds: number[]; permissionIds: number[] };

    // Validations
    await this.findOneSimple(id);

    await this.modulesServices.findByIds(moduleIds, {
      validateList: true,
    });
    await this.permissionsServices.findByIds(permissionIds, {
      validateList: true,
    });

    const rolePermissions = this.rolePermissionsRepository.create(
      permissions.map((permission) => ({ ...permission, roleId: id })),
    );

    return await this.rolePermissionsRepository.save(rolePermissions);
  }

  async removePermission(
    id: number,
    removePermissionsRoleDto: RemovePermissionsRoleDto,
  ) {
    await this.findOneSimple(id);

    await this.rolePermissionsRepository
      .createQueryBuilder()
      .delete()
      .where({ roleId: id, ...removePermissionsRoleDto })
      .execute();
  }
}
