import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { CreateOrderDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';
import { UserService } from '../user/user.service';
import { PaymentMethodService } from '../paymentMethod/paymentMethod.service';
import { StatusService } from '../status/status.service';
import { SolutionService } from '../solution/solution.service';
import { IndividualClientService } from '../client/individual-client/individual-client.service';
import { CorporateClientService } from '../client/corporate-client/corporate-client.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order) private readonly orderRepository: Repository<Order>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService,
    private readonly userService: UserService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly statusService: StatusService,
    private readonly solutionService: SolutionService,
    private readonly individualClientService: IndividualClientService,
    private readonly corporateClientService: CorporateClientService
  ) {
  }

  async getById(companyId: number, orderId: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.solutions', 'solutions')
      .leftJoinAndSelect('order.stuff', 'stuff')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('order.individualClient', 'individualClient')
      .leftJoinAndSelect('order.corporateClient', 'corporateClient')
      .leftJoinAndSelect('order.company', 'company')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.user', 'client')
      .where('order.id = :orderId', {orderId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.orderRepository
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.solutions', 'solutions')
      .leftJoinAndSelect('order.stuff', 'stuff')
      .leftJoinAndSelect('order.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('order.individualClient', 'individualClient')
      .leftJoinAndSelect('order.corporateClient', 'corporateClient')
      .leftJoinAndSelect('order.company', 'company')
      .leftJoinAndSelect('order.status', 'status')
      .leftJoinAndSelect('order.user', 'client')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreateOrderDto, companyId: number, userId: number) {
    const company = await this.companyService.getCompanyById(companyId, false);
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const companyWithOrders = await this.companyService.getCompanyWithEntity(companyId, 'order');
    const orderNumber = companyWithOrders.orders.length + 1;

    let client = {};

    if (dto.clientType === 'individualClient') {
      client = await this.individualClientService.getById(dto.clientId, companyId);
    } else {
      client = await this.corporateClientService.getById(dto.clientId, companyId);
    }

    if (!client) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const paymentMethod = await this.paymentMethodService.getById(dto.paymentMethodId, companyId);
    if (!paymentMethod) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const status = await this.statusService.getById(dto.statusId, companyId);
    if (!status) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const solutions = await Promise.all(dto.solutionsIds.map(async (solutionId) => {
      const solution = await this.solutionService.getById(solutionId, companyId);
      if (!solution) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
      }
      return solution;
    }));

    if (!solutions.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const stuff = await Promise.all(dto.solutionsIds.map(async (userId) => {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
      }
      return user;
    }));

    if (!stuff.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    return this.orderRepository.save({
      orderNumber: orderNumber,
      clientType: dto.clientType,
      orderDate: dto.orderDate,
      address: dto.address,
      price: dto.price,
      comment: dto.comment,
      solutions: solutions,
      stuff: stuff,
      paymentMethod: paymentMethod,
      ...(dto.clientType === 'individualClient'
        ? {individualClient: client}
        : {corporateClient: client}),
      company: company,
      status: status,
      user: user
    });
  }
}
