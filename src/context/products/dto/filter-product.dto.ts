import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { GenericFilter } from 'src/common/dto/generic-filter.dto';

@ValidatorConstraint()
export class IsPriceMaxValid implements ValidatorConstraintInterface {
  validate(value: number, validationArguments: ValidationArguments) {
    const { object } = validationArguments;

    const price_min = (object as FiltersProductsDto).priceMin;

    return value > price_min || price_min == null;
  }
}

export class FiltersProductsDto extends GenericFilter {
  @ApiProperty({
    type: 'number',
    required: false,
  })
  @IsInt()
  @IsOptional()
  categoryId?: number;

  @ApiProperty({
    type: 'string',
    minLength: 3,
    required: false,
  })
  @IsString()
  @MinLength(3)
  @IsOptional()
  title?: string;

  @ApiProperty({
    type: 'number',
    minimum: 1,
    required: false,
  })
  @Min(1)
  @IsPositive()
  @IsOptional()
  priceMin?: number;

  @ApiProperty({
    type: 'number',
    minimum: 1,
    required: false,
  })
  @Min(1)
  @IsPositive()
  @Validate(IsPriceMaxValid, {
    message: 'price_max must be greater than price_min',
  })
  @IsOptional()
  priceMax?: number;
}
