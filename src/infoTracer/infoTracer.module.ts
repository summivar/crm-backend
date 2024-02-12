import { Module } from '@nestjs/common';
import { InfoTracerController } from './infoTracer.controller';
import { InfoTracerService } from './infoTracer.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { InfoTracer } from './entities/infoTracer.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InfoTracer
    ]),
    UserModule,
    CompanyModule
  ],
  controllers: [InfoTracerController],
  providers: [InfoTracerService],
  exports: [InfoTracerService]
})
export class InfoTracerModule {
}
