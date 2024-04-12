import fastifyCookie from '@fastify/cookie';
import multipart from '@fastify/multipart';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { QueryExceptionFilter } from './common/filters/query-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { swaggerConfig } from './config/swagger/swagger.config';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { RequestValidationMessageDto } from './common/dto/request-validation-response.dto';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  await app.register(fastifyCookie as any, {
    secret: configService.get('COOKIE_SECRET'),
  });

  app.register(multipart as any);
  app.register(fastifyStatic as any, {
    root: join(process.cwd(), configService.get('STATIC_DIR_PATH')),
  });

  app.setGlobalPrefix(configService.get('GLOBAL_PREFIX'));

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new QueryExceptionFilter());

  const port = configService.get('PORT');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors) => {
        const exceptions = errors.map((error) => {
          return new RequestValidationMessageDto({
            property: error.property,
            value: error.value,
            constraints: error.constraints,
          });
        });

        return new BadRequestException(exceptions);
      },
    }),
  );

  swaggerConfig(app);

  await app.listen(port, '0.0.0.0');
}
bootstrap();
