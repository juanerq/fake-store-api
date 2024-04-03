import { ApiProperty } from '@nestjs/swagger';

type ErrorConstraints = Record<string, string>;

export class RequestValidationMessageDto {
  @ApiProperty({
    type: 'string',
    example: 'price',
  })
  property: string;

  @ApiProperty({
    type: 'unknown',
    example: null,
  })
  value: unknown;

  @ApiProperty({
    example: {
      isPositive: 'price must be a positive number',
      min: 'price must not be less than 1',
    },
  })
  constraints: ErrorConstraints;

  constructor(message: {
    property: string;
    value: unknown;
    constraints: ErrorConstraints;
  }) {
    this.property = message.property;
    this.value = message.value;
    this.constraints = message.constraints;
  }
}

export class RequestValidationResponseDto {
  @ApiProperty({
    isArray: true,
    type: () => [RequestValidationMessageDto],
  })
  message: RequestValidationMessageDto[];

  @ApiProperty({
    type: 'string',
    default: 'Bad Request',
    example: 'Bad Request',
  })
  error: string;

  @ApiProperty({
    type: 'number',
    default: 400,
    example: 400,
  })
  statusCode: number;
}
