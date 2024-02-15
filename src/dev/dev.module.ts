import { Module } from '@nestjs/common';
import { DevController } from './dev.controller';
import { DevService } from './dev.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { InfoTracer } from '../infoTracer/entities/infoTracer.entity';
import { PaymentMethod } from '../paymentMethod/entities/paymentMethod.entity';
import { Order } from '../order/entities/order.entity';
import { Solution } from '../solution/entities/solution.entity';
import { Status } from '../status/entities/status.entity';
import { Company } from '../company/entities/company.entity';
import { IndividualClient } from '../client/individual-client/entity/individualClient.entity';
import { CorporateClient } from '../client/corporate-client/entity/corporateClient.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      InfoTracer,
      PaymentMethod,
      Order,
      Solution,
      Status,
      Company,
      IndividualClient,
      CorporateClient
    ])
  ],
  controllers: [DevController],
  providers: [DevService]
})
export class DevModule {}
