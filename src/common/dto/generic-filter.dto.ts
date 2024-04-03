import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { SortOrder } from '../enums/sort-order.enum';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GenericFilter {
  @ApiProperty({
    type: 'number',
    minimum: 1,
    required: false,
    default: 1,
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    type: 'number',
    minimum: 1,
    maximum: 50,
    required: false,
    default: 10,
    example: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  @IsOptional()
  pageSize?: number = 10;

  @ApiProperty({
    type: 'string',
    required: false,
    default: 'createdAt',
    example: 'createdAt',
  })
  @IsString()
  @IsOptional()
  orderBy?: string = 'createdAt';

  @ApiProperty({
    enum: SortOrder,
    required: false,
  })
  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC;
}
