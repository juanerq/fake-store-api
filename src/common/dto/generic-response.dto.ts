import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class GenericResponseDto<T> {
  @ApiProperty()
  status: boolean;

  @ApiProperty({
    examples: [400, 401, 500],
  })
  statusCode: HttpStatus;

  @ApiProperty({
    description: 'Tipo de error',
    examples: ['Bad Request', 'Internal Server Error', 'Unauthorized'],
  })
  error?: string;

  @ApiProperty({
    examples: ['Record with 1 not found', 'Record already exists'],
  })
  message?: string | string[];

  @ApiProperty()
  path: string;

  result: T;
}
