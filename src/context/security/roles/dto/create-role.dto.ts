import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateRoleDto {
  @ApiProperty({
    minLength: 3,
    example: 'ADMIN',
  })
  @IsString()
  @MinLength(3)
  name: string;
}
