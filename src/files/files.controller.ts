import { FastifyReply, FastifyRequest } from 'fastify';
import {
  BadRequestException,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

// Decorators
import { Auth } from 'src/context/security/auth/decorators';
import { ApiCreatedGenericResponse } from 'src/common/decorators';

// Dto
import { FindImageDto } from './dto/find-image.dto';
import { FilesUploadDto } from './dto/files-upload.dto';
import { RequestValidationResponseDto } from 'src/common/dto';
import { FilesUploadResponseDto } from './dto/files-upload-response.dto';

// Services
import { FilesService } from './files.service';

@ApiTags('7 Upload files')
@ApiBearerAuth()
@ApiCreatedGenericResponse({
  status: HttpStatus.BAD_REQUEST,
  description: 'Invalid properties',
  dataDto: RequestValidationResponseDto,
})
@Auth({ moduleName: 'files' })
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @ApiOkResponse({
    description: 'Returns the requested image',
    content: {
      'image/jpeg': {},
      'image/jpg': {},
      'image/png': {},
      'image/gif': {},
    },
  })
  @ApiCreatedGenericResponse<any>({
    description: 'File not found',
    dataDto: 'File not found',
    status: HttpStatus.NOT_FOUND,
  })
  @Get(':destination/:imageName')
  findProductImage(@Res() reply: FastifyReply, @Param() params: FindImageDto) {
    const { imageName, destination } = params;

    const { pathFromRoot } = this.filesService.getFilePath(imageName, {
      destination,
    });

    reply.sendFile(pathFromRoot);
  }

  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiCreatedGenericResponse({
    dataDto: FilesUploadResponseDto,
    status: HttpStatus.CREATED,
  })
  @Post(':destination')
  async uploadImage(
    @Req() req: FastifyRequest,
    @Param() params: FilesUploadDto,
  ) {
    if (!req.isMultipart()) {
      throw new BadRequestException('Request is not multipart');
    }

    const { destination } = params;

    const multiPart = req.files();

    return this.filesService.uploadFiles(multiPart, {
      destination,
    });
  }
}
