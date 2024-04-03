import { Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  getSchemaPath,
} from '@nestjs/swagger';
import { Product } from 'src/context/products/entities/product.entity';
import { GenericResponseDto, PageMetaDto } from '../dto';
import { RequestValidationResponseDto } from '../dto/request-validation-response.dto';

type ApiCreatedGenericResponseType<DataDto> = {
  dataDto: DataDto;
} & ApiResponseMetadata;

export const ApiPaginatedResponse = <DataDto extends Type<unknown>>(
  params: ApiCreatedGenericResponseType<DataDto>,
) => {
  const response = {
    schema: {
      allOf: [
        { $ref: getSchemaPath(GenericResponseDto) },
        {
          properties: {
            result: {
              properties: {
                data: {
                  items: { $ref: getSchemaPath(params.dataDto) },
                },
                meta: { $ref: getSchemaPath(PageMetaDto) },
              },
            },
          },
        },
      ],
    },
    ...params,
  };

  return applyDecorators(
    ApiExtraModels(Product, RequestValidationResponseDto, PageMetaDto),
    ApiResponse(response),
  );
};
