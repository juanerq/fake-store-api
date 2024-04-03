import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class GenericResponseDto<T> {
  @ApiProperty({
    description: 'true = success / false = error',
  })
  status: boolean;

  @ApiProperty({
    examples: [200, 201, 400, 401, 500],
  })
  statusCode: HttpStatus;

  @ApiProperty({
    example: 'Error details',
    examples: [
      'Bad Request',
      'Internal Server Error',
      'Unauthorized',
      'QueryFailedError',
    ],
    required: false,
  })
  error?: string;

  @ApiProperty({
    required: false,
    example: 'Error or success message',
    examples: ['Record with 1 not found', 'Record already exists'],
  })
  message?: string | string[];

  @ApiProperty({
    example: '/api/products',
  })
  path: string;

  result: T;
}
