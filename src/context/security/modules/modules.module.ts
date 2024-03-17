import { Module, forwardRef } from '@nestjs/common';
import { ModulesService } from './modules.service';
import { ModulesController } from './modules.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module as ModuleEntity } from './entities/module.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModuleEntity]),
    UtilsModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [ModulesController],
  providers: [ModulesService],
  exports: [TypeOrmModule, ModulesService],
})
export class ModulesModule {}
