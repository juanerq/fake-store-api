import { Module } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { UtilsModule } from 'src/utils/utils.module';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleEntity]), UtilsModule],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [TypeOrmModule, ModulesService],
})
export class ModulesModule {}
