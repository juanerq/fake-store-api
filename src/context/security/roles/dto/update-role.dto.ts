import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class UpdateRoleDto {
  @ApiProperty({
    minLength: 3,
    example: 'USER',
  })
  @IsString()
  @MinLength(3)
  name: string;
}
