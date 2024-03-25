import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FastifyReply, FastifyRequest } from 'fastify';
import { FindImageDto } from './dto/find-image.dto';
import { FilesUploadDto } from './dto/files-upload.dto';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':destination/:imageName')
  findProductImage(@Res() reply: FastifyReply, @Param() params: FindImageDto) {
    const { imageName, destination } = params;

    const { pathFromRoot } = this.filesService.getStaticImage(imageName, {
      destination,
    });

    reply.sendFile(pathFromRoot);
  }

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
