import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateModuleDto {
  @ApiProperty({
    minLength: 3,
    required: true,
    example: 'products',
  })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({
    minLength: 3,
    required: false,
    example: 'products',
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  detail: string;
}
