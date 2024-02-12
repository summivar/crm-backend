import { forwardRef, Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { CompanyModule } from '../company/company.module';
import { UserModule } from '../user/user.module';
import { PaymentMethodModule } from '../paymentMethod/paymentMethod.module';
import { SolutionModule } from '../solution/solution.module';
import { StatusModule } from '../status/status.module';
import { IndividualClientModule } from '../client/individual-client/individual-client.module';
import { CorporateClientModule } from '../client/corporate-client/corporate-client.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
    ]),
    CompanyModule,
    UserModule,
    PaymentMethodModule,
    SolutionModule,
    StatusModule,
    IndividualClientModule,
    CorporateClientModule
  ],
  providers: [OrderService],
  controllers: [OrderController],
  exports: [OrderService]
})
export class OrderModule {
}
