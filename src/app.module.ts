import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductsModule } from './context/products/products.module';
import { validateEnvironment } from './config/env/env.validation';
import { TypeOrmConfigService } from './config/database/typeorm.config';
import { CategoriesModule } from './context/categories/categories.module';
import { ModulesModule } from './context/security/modules/modules.module';
import { PermissionsModule } from './context/security/permissions/permissions.module';
import { RolesModule } from './context/security/roles/roles.module';
import { UsersModule } from './context/users/users.module';
import { UtilsModule } from './utils/utils.module';
import { AuthModule } from './context/security/auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EmailModule } from './context/email/email.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
    ProductsModule,
    CategoriesModule,
    ModulesModule,
    PermissionsModule,
    RolesModule,
    UsersModule,
    UtilsModule,
    AuthModule,
    EmailModule,
    EventEmitterModule.forRoot(),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
