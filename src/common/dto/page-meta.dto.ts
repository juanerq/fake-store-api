import { ApiProperty } from '@nestjs/swagger';
import { GenericFilter } from './generic-filter.dto';

interface PageMetaDtoParameters {
  pageOptionsDto: GenericFilter;
  itemCount: number;
}

export class PageMetaDto {
  @ApiProperty({
    type: 'number',
    example: 1,
  })
  readonly page: number;

  @ApiProperty({
    type: 'number',
    example: 10,
  })
  readonly pageSize: number;

  @ApiProperty({
    type: 'number',
    example: 16,
    description: 'Number of records found',
  })
  readonly itemCount: number;

  @ApiProperty({
    type: 'number',
    example: '2',
    description: 'Number of pages',
  })
  readonly pageCount: number;

  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDto, itemCount }: PageMetaDtoParameters) {
    this.page = pageOptionsDto.page;
    this.pageSize = pageOptionsDto.pageSize;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.pageSize);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
