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
import fastifyCookie from '@fastify/cookie';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  await app.register(fastifyCookie as any, {
    secret: configService.get('COOKIE_SECRET'),
  });

  app.setGlobalPrefix('api');

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
        const result = errors.map((error) => ({
          property: error.property,
          value: error.value,
          constraints: error.constraints,
        }));

        return new BadRequestException(result);
      },
    }),
  );

  await app.listen(port);
}
bootstrap();
