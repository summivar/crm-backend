import { Module } from '@nestjs/common';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Status
    ]),
    UserModule,
    CompanyModule
  ],
  controllers: [StatusController],
  providers: [StatusService]
})
export class StatusModule {
}
