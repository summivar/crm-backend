import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualClientService } from './individual-client.service';
import { IndividualClientController } from './individual-client.controller';
import { IndividualClient } from './entity/individualClient.entity';
import { UserModule } from '../../user/user.module';
import { CompanyModule } from '../../company/company.module';
import { InfoTracerModule } from '../../infoTracer/infoTracer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      IndividualClient
    ]),
    UserModule,
    CompanyModule,
    InfoTracerModule
  ],
  providers: [IndividualClientService],
  controllers: [IndividualClientController],
  exports: [IndividualClientService],
})
export class IndividualClientModule {
}
