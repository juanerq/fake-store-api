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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Auth } from '../security/auth/decorators';
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
import { User } from './entities';

@ApiTags('2 Users')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'users' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiCreatedGenericResponse({
    dataDto: User,
    status: HttpStatus.CREATED,
    description: 'Successfully created product',
  })
  @ApiConflictResponse({
    description: 'Record already exists',
    type: GenericResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Role not found',
    type: GenericResponseDto,
  })
  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.register(createUserDto);
  }

  @ApiCreatedGenericResponse({
    dataDto: User,
    resultType: 'array',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiCreatedGenericResponse({
    dataDto: User,
  })
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  @ApiCreatedGenericResponse({
    dataDto: User,
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
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @ApiNoContentResponse({
    description: 'Removed product',
  })
  @ApiNotFoundResponse({
    description: 'Product not found',
    type: GenericResponseDto,
  })
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
