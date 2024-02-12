import { Module } from '@nestjs/common';
import { SolutionController } from './solution.controller';
import { SolutionService } from './solution.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { Solution } from './entities/solution.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Solution
    ]),
    UserModule,
    CompanyModule
  ],
  controllers: [SolutionController],
  providers: [SolutionService],
  exports: [SolutionService],
})
export class SolutionModule {
}
