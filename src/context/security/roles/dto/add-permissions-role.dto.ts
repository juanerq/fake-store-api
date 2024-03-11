import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class AddPermissionDto {
  @IsInt()
  @IsPositive()
  moduleId: number;

  @IsInt()
  @IsPositive()
  permissionId: number;
}

export class AddPermissionListDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddPermissionDto)
  permissions: AddPermissionDto[];
}
