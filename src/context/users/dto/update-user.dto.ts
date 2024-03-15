import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsArray, IsNumber, IsPositive } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsArray()
  @IsNumber({}, { each: true })
  @IsPositive({ each: true })
  roles: number[];
}
