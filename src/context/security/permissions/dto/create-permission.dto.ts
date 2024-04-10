import { IsEnum, IsString, MinLength } from 'class-validator';
import { PermissionTypes } from '../enums/permission-types.enum';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePermissionDto {
  @ApiProperty({
    minLength: 3,
    required: true,
    example: 'CREATE',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    enum: PermissionTypes,
    required: true,
    example: PermissionTypes.POST,
  })
  @IsEnum(PermissionTypes)
  type: PermissionTypes;
}
