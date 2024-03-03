import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ConfigService } from '@nestjs/config';
import { QueryExceptionFilter } from './common/filters/query-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  const configService = app.get(ConfigService);

  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalFilters(new QueryExceptionFilter());

  const port = configService.get('PORT');

  await app.listen(port);
}
bootstrap();
