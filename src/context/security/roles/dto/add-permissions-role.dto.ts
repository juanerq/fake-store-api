import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsPositive,
  ValidateNested,
} from 'class-validator';

export class AddPermissionDto {
  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsInt()
  @IsPositive()
  moduleId: number;

  @ApiProperty({
    required: true,
    example: 1,
  })
  @IsInt()
  @IsPositive()
  permissionId: number;
}

export class AddPermissionListDto {
  @ApiProperty({
    type: () => [AddPermissionDto],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => AddPermissionDto)
  permissions: AddPermissionDto[];
}
