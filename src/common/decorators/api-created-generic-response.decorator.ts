import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { Product } from 'src/context/products/entities/product.entity';
import { GenericResponseDto } from '../dto';
import { RequestValidationResponseDto } from '../dto/request-validation-response.dto';
import { Category } from 'src/context/categories/entities/category.entity';
import {
  LoginResponseDto,
  RefreshTokenRespponseDto,
} from '../dto/login-response.dto';
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';
import { User } from 'src/context/users/entities';

type ResultType = 'string' | 'array';

type ApiCreatedGenericResponseType<DataDto> = {
  dataDto: DataDto;
  resultType?: ResultType;
} & ApiResponseMetadata;

export const ApiCreatedGenericResponse = <DataDto extends Type<unknown>>(
  params: ApiCreatedGenericResponseType<DataDto>,
) => {
  let properties: Record<string, SchemaObject | ReferenceObject>;

  if (params.resultType === 'array') {
    properties = {
      result: {
        items: {
          $ref: getSchemaPath(params.dataDto),
          type: params.resultType,
        },
      },
    };
  } else if (params.resultType === 'string') {
    properties = {
      result: {
        example: params.dataDto,
        type: params.resultType,
      },
    };
  } else {
    properties = {
      result: {
        $ref: getSchemaPath(params.dataDto),
        type: params.resultType,
      },
    };
  }

  const response: ApiResponseOptions = {
    schema: {
      allOf: [{ $ref: getSchemaPath(GenericResponseDto) }, { properties }],
    },
    status: HttpStatus.OK,
    ...params,
  };

  return applyDecorators(
    ApiExtraModels(
      User,
      Product,
      Category,
      RequestValidationResponseDto,
      LoginResponseDto,
      RefreshTokenRespponseDto,
    ),
    ApiResponse(response),
  );
};
