import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class RemovePermissionsRoleDto {
  @ApiProperty({
    example: 1,
    required: true,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  moduleId: number;

  @ApiProperty({
    example: 2,
    required: false,
  })
  @Transform(({ value }) => parseInt(value))
  @IsNumber()
  @IsPositive()
  @IsOptional()
  permissionId?: number;
}
