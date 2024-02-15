import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Company } from '../company/entities/company.entity';
import { Order } from '../order/entities/order.entity';
import { Repository } from 'typeorm';
import { InfoTracer } from '../infoTracer/entities/infoTracer.entity';
import { PaymentMethod } from '../paymentMethod/entities/paymentMethod.entity';
import { Solution } from '../solution/entities/solution.entity';
import { Status } from '../status/entities/status.entity';
import { IndividualClient } from '../client/individual-client/entity/individualClient.entity';
import { CorporateClient } from '../client/corporate-client/entity/corporateClient.entity';

@Injectable()
export class DevService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(InfoTracer)
    private readonly infoTracerRepository: Repository<InfoTracer>,
    @InjectRepository(PaymentMethod)
    private readonly paymentMethodRepository: Repository<PaymentMethod>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @InjectRepository(Solution)
    private readonly solutionRepository: Repository<Solution>,
    @InjectRepository(Status)
    private readonly statusRepository: Repository<Status>,
    @InjectRepository(IndividualClient)
    private readonly individualClientRepository: Repository<IndividualClient>,
    @InjectRepository(CorporateClient)
    private readonly corporateClientRepository: Repository<CorporateClient>,
  ) {
  }
  async deleteAll() {
    await this.userRepository.delete({});
    await this.solutionRepository.delete({});
    await this.individualClientRepository.delete({});
    await this.corporateClientRepository.delete({});
    await this.infoTracerRepository.delete({});
    await this.paymentMethodRepository.delete({});
    await this.statusRepository.delete({});
    await this.orderRepository.delete({});
    await this.companyRepository.delete({});
  }
}
