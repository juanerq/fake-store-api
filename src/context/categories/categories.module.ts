import { Module } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from '../security/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Category]), UtilsModule, AuthModule],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [TypeOrmModule, CategoriesService],
})
export class CategoriesModule {}
