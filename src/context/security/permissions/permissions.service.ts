import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from './entities/permission.entity';
import { In, Repository } from 'typeorm';
import { PermissionTypes } from './enums/permission-types.enum';
import { Utils } from 'src/utils/utils';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    private readonly utils: Utils,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const permission = this.permissionRepository.create(createPermissionDto);
    return await this.permissionRepository.save(permission);
  }

  async findAll() {
    return await this.permissionRepository.find();
  }

  async findOne(id: number) {
    const permission = await this.permissionRepository.findOneBy({ id });
    if (!permission)
      throw new NotFoundException(`Permission with id ${id} not found`);

    return permission;
  }

  async findByIds(
    ids: number[],
    options: { validateList: boolean } = { validateList: false },
  ) {
    const { validateList } = options;

    const permissions = await this.permissionRepository.find({
      where: { id: In(ids) },
    });

    this.utils.validateMissingRecordsById({
      records: permissions,
      ids,
      notFoundException: validateList,
      customErrorMessage: {
        plural: 'Permissions with ids (:id_list) not found',
        singular: 'Permission with id (:id_list) not found',
      },
    });

    return permissions;
  }

  getPermissionTypes() {
    return Object.values(PermissionTypes);
  }

  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permission = await this.findOne(id);

    const permissionToUpdate = this.permissionRepository.create(
      this.permissionRepository.merge(permission, updatePermissionDto),
    );

    return await this.permissionRepository.save(permissionToUpdate);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.permissionRepository.remove(role);
  }
}
