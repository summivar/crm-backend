import { Module } from '@nestjs/common';
import { PaymentMethodController } from './paymentMethod.controller';
import { PaymentMethodService } from './paymentMethod.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { CompanyModule } from '../company/company.module';
import { PaymentMethod } from './entities/paymentMethod.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentMethod
    ]),
    UserModule,
    CompanyModule
  ],
  controllers: [PaymentMethodController],
  providers: [PaymentMethodService]
})
export class PaymentMethodModule {
}
