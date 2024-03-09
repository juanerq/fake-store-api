import { IsEnum, IsString, MinLength } from 'class-validator';
import { PermissionTypes } from '../enums/permission-types.enum';

export class CreatePermissionDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsEnum(PermissionTypes)
  type: PermissionTypes;
}
