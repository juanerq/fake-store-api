import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const role = this.roleRepository.create(createRoleDto);
    return await this.roleRepository.save(role);
  }

  async findAll() {
    return await this.roleRepository.find();
  }

  async findOne(id: number) {
    const role = await this.roleRepository.findOneBy({ id });
    if (!role) throw new NotFoundException(`Role with ${id} not found`);

    return role;
  }

  async update(id: number, updateRoleDto: UpdateRoleDto) {
    const role = await this.findOne(id);

    const roleToUpdate = this.roleRepository.create(
      this.roleRepository.merge(role, updateRoleDto),
    );

    return await this.roleRepository.save(roleToUpdate);
  }

  async remove(id: number) {
    const role = await this.findOne(id);
    await this.roleRepository.remove(role);
  }
}
