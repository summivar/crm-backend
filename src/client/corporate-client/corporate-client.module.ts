import { Module } from '@nestjs/common';
import { CorporateClientController } from './corporate-client.controller';
import { CorporateClientService } from './corporate-client.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CorporateClient } from '../entities/corporateClient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CorporateClient
    ])
  ],
  controllers: [CorporateClientController],
  providers: [CorporateClientService],
  exports: [CorporateClientService],
})
export class CorporateClientModule {
}
