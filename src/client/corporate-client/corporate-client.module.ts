import { Module } from '@nestjs/common';
import { CorporateClientController } from './corporate-client.controller';
import { CorporateClientService } from './corporate-client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateClient } from './entity/corporateClient.entity';
import { UserModule } from '../../user/user.module';
import { CompanyModule } from '../../company/company.module';
import { InfoTracerModule } from '../../infoTracer/infoTracer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorporateClient
    ]),
    UserModule,
    CompanyModule,
    InfoTracerModule
  ],
  controllers: [CorporateClientController],
  providers: [CorporateClientService],
  exports: [CorporateClientService],
})
export class CorporateClientModule {
}
