import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Entitys
import { User } from './entities/user.entity';

// Services
import { RolesService } from '../security/roles/roles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly rolesService: RolesService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { password, roles, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      isActive: true,
      password: bcrypt.hashSync(password, 10),
    });

    if (roles) {
      const rolesFound = await this.rolesService.findByIds(roles, {
        validateList: true,
      });
      user.roles = rolesFound;
    }

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  async findAll() {
    return await this.userRepository.find({
      relations: {
        roles: true,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOneBy({ id });
    if (!user) throw new NotFoundException(`User with ${id} not found`);

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { password, roles, ...toUpdate } = updateUserDto;

    const user = await this.userRepository.preload({ id, ...toUpdate });
    if (!user) throw new NotFoundException(`User with id ${id} not found`);

    if (roles) {
      const roleList = await this.rolesService.findByIds(roles, {
        validateList: true,
      });

      user.roles = roleList;
    }

    if (password) {
      user.password = bcrypt.hashSync(password, 10);
    }

    await this.userRepository.save(user);

    delete user.password;

    return user;
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }
}
