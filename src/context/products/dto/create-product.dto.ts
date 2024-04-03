import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    minLength: 3,
    example: 'Nintendo Switch',
  })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiProperty({
    minLength: 5,
    required: false,
    example: 'video game console',
  })
  @IsString()
  @MinLength(5)
  @IsOptional()
  description: string;

  @ApiProperty({
    minimum: 1,
    example: 300,
  })
  @Min(1)
  @IsPositive()
  price: number;

  @ApiProperty({
    minimum: 1,
    example: 10,
  })
  @Min(1)
  @IsPositive()
  quantity: number;

  @ApiProperty({
    type: () => [String],
    isArray: true,
    required: false,
    example:
      'http://api.fake-store/api/file/products/fkn32ofoFFfwofnwin903b.png',
  })
  @IsUrl({ require_tld: false }, { each: true })
  @IsOptional({ each: true })
  images: string[];

  @ApiProperty({
    type: 'number',
    isArray: true,
    minLength: 1,
    example: [10],
  })
  @IsInt({ each: true })
  @ArrayMinSize(1)
  @IsArray()
  categories: number[];
}
