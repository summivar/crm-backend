import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IndividualClientService } from './individual-client.service';
import { IndividualClientController } from './individual-client.controller';
import { IndividualClient } from './entity/individualClient.entity';

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
