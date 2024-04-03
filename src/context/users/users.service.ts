import { InjectRepository } from '@nestjs/typeorm';
import {
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Dtos
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

// Entitys
import { User } from './entities/user.entity';

// Services
import { RolesService } from '../security/roles/roles.service';
import { AuthService } from '../security/auth/auth.service';
import { TypedEventEmitter } from 'src/common/events/events-emitter/typed-event-emitter.class';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly rolesService: RolesService,
    private readonly eventEmitter: TypedEventEmitter,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { password, roles, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      isActive: false,
      password: bcrypt.hashSync(password, 10),
    });

    if (roles) {
      const rolesFound = await this.rolesService.findByIds(roles, {
        validateList: true,
      });
      user.roles = rolesFound;
    }

    await this.userRepository.save(user);

    const confirmUrlToken = this.authService.getConfirmUrlToken({
      email: userData.email,
    });

    this.eventEmitter.emit('user.verify-email', {
      email: user.email,
      name: user.fullName,
      confirmation_url: confirmUrlToken,
    });

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

  async findUserAuth(filters: { email: string }) {
    return await this.userRepository.findOne({
      where: filters,
      select: { email: true, password: true, id: true },
      relations: { roles: true },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: { roles: true },
    });
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

  async activateUser(filters: { email: string } | { id: number }) {
    try {
      const user = await this.userRepository.findOne({ where: filters });
      if (!user) throw new NotFoundException('User account not found');

      user.isActive = true;

      return await this.userRepository.save(user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException('Error activating user');
    }
  }
}
