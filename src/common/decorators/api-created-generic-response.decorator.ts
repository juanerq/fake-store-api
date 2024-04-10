import { HttpStatus, Type, applyDecorators } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiResponseMetadata,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';

// Interface
import {
  ReferenceObject,
  SchemaObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

// Dto
import { GenericResponseDto } from '../dto';
import { RequestValidationResponseDto } from '../dto/request-validation-response.dto';
import {
  LoginResponseDto,
  RefreshTokenRespponseDto,
} from '../dto/login-response.dto';

// Entities
import { User } from 'src/context/users/entities';
import { Product } from 'src/context/products/entities/product.entity';
import { Category } from 'src/context/categories/entities/category.entity';
import { Permission } from 'src/context/security/permissions/entities/permission.entity';
import { Module } from 'src/context/security/modules/entities/module.entity';

// Types
type ResultType = 'string' | 'array' | 'any';

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
  } else if (['any', 'string'].includes(params.resultType)) {
    properties = {
      result: {
        example: params.dataDto,
      },
    };

    if (params.resultType !== 'any')
      properties.result['type'] = params.resultType;
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
      Permission,
      Module,
      RequestValidationResponseDto,
      LoginResponseDto,
      RefreshTokenRespponseDto,
    ),
    ApiResponse(response),
  );
};
