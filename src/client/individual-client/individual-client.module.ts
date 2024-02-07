import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualClient } from '../entities/individualClient.entity';
import { IndividualClientService } from './individual-client.service';
import { IndividualClientController } from './individual-client.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([IndividualClient])
  ],
  providers: [IndividualClientService],
  controllers: [IndividualClientController],
  exports: [IndividualClientService],
})
export class IndividualClientModule {
}
