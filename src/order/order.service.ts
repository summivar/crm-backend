import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { EntityManager, Repository } from 'typeorm';
import { CompanyService } from '../company/company.service';
import { CreateOrderDto, EditOrderDto } from './dtos';
import { EXCEPTION_MESSAGE } from '../constants';
import { UserService } from '../user/user.service';
import { PaymentMethodService } from '../paymentMethod/paymentMethod.service';
import { StatusService } from '../status/status.service';
import { SolutionService } from '../solution/solution.service';
import { IndividualClientService } from '../client/individual-client/individual-client.service';
import { CorporateClientService } from '../client/corporate-client/corporate-client.service';
import { IndividualClient } from '../client/individual-client/entity/individualClient.entity';
import { CorporateClient } from '../client/corporate-client/entity/corporateClient.entity';
import { GetOrderFilterDto } from './dtos/getOrderFilter.dto';

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
    private readonly corporateClientService: CorporateClientService,
  ) {
  }

  async getFiltered(dto: GetOrderFilterDto, companyId: number) {
    const {
      statusId,
      managerId,
      dateFrom,
      dateTo,
      clientType,
      clientId,
      solutionIds,
      stuffIds,
      priceFrom,
      priceTo,
      paymentMethodId,
    } = dto;

    let query = this.orderRepository.createQueryBuilder('order')
      .leftJoinAndSelect('order.company', 'company')
      .where('company.id = :companyId', { companyId: Number(companyId) });

    query = query.leftJoinAndSelect('order.status', 'status');
    if (statusId) {
      query = query.andWhere('status.id = :statusId', { statusId: Number(statusId) });
    }

    query = query.leftJoinAndSelect('order.user', 'user');
    if (managerId) {
      query = query.andWhere('user.id = :managerId', { managerId: Number(managerId) });
    }

    if (dateFrom) {
      query = query.andWhere('order.orderDate >= :dateFrom', { dateFrom });
    }
    if (dateTo) {
      query = query.andWhere('order.orderDate <= :dateTo', { dateTo });
    }

    if (clientType === 'individualClient' && clientId) {
      query = query.leftJoinAndSelect('order.individualClient', 'individualClient');
      query = query.andWhere('individualClient.id = :clientId', { clientId: Number(clientId) });
    }
    if (clientType === 'corporateClient' && clientId) {
      query = query.leftJoinAndSelect('order.corporateClient', 'corporateClient');
      query = query.andWhere('corporateClient.id = :clientId', { clientId: Number(clientId) });
    }

    query = query.leftJoinAndSelect('order.solutions', 'solution');
    if (solutionIds) {
      let numericArray: number[] = [];
      if (Array.isArray(solutionIds)) {
        numericArray = solutionIds.map(Number);
      } else {
        numericArray.push(Number(solutionIds));
      }
      if (numericArray.length > 0) {
        query = query.andWhere('solution.id IN (:...solutionIds)', { solutionIds: numericArray });
      }
    }

    query = query.leftJoinAndSelect('order.stuff', 'stuff');
    if (stuffIds) {
      let numericArray: number[] = [];
      if (Array.isArray(stuffIds)) {
        numericArray = stuffIds.map(Number);
      } else {
        numericArray.push(Number(stuffIds));
      }
      if (numericArray.length > 0) {
        query = query.andWhere('stuff.id IN (:...stuffIds)', { stuffIds: numericArray });
      }
    }

    if (priceFrom) {
      query = query.andWhere('order.price >= :priceFrom', { priceFrom: Number(priceFrom) });
    }
    if (priceTo) {
      query = query.andWhere('order.price <= :priceTo', { priceTo: Number(priceTo) });
    }

    query = query.leftJoinAndSelect('order.paymentMethod', 'paymentMethod');
    if (paymentMethodId) {
      query = query.andWhere('paymentMethod.id = :paymentMethodId', { paymentMethodId: Number(paymentMethodId) });
    }

    return query.getManyAndCount();
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
      .where('order.id = :orderId', { orderId })
      .andWhere('company.id = :companyId', { companyId })
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
      .where('company.id = :companyId', { companyId })
      .getManyAndCount();
  }

  async create(dto: CreateOrderDto, companyId: number, userId: number) {
    const company = await this.companyService.getCompanyById(companyId, false);
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('company'));
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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('client'));
    }

    const user = await this.userService.getUserById(userId);
    if (!user) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('user'));
    }

    const paymentMethod = await this.paymentMethodService.getById(dto.paymentMethodId, companyId);
    if (!paymentMethod) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('paymentMethod'));
    }

    const status = await this.statusService.getById(dto.statusId, companyId);
    if (!status) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('status'));
    }

    const solutions = await Promise.all(dto.solutionsIds.map(async (solutionId) => {
      const solution = await this.solutionService.getById(solutionId, companyId);
      if (!solution) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('solution'));
      }
      return solution;
    }));

    if (!solutions.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('solution'));
    }

    const stuff = await Promise.all(dto.stuffIds.map(async (userId) => {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('user'));
      }
      return user;
    }));

    if (!stuff.length) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('stuff'));
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
        ? { individualClient: client }
        : { corporateClient: client }),
      company: company,
      status: status,
      user: user,
    });
  }

  async edit(dto: EditOrderDto, companyId: number, orderId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, orderId, 'order');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('company'));
    }

    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('order'));
    }

    if (dto.clientType && dto.clientId) {
      let client = {};
      if (dto.clientType === 'individualClient') {
        client = await this.individualClientService.getById(dto.clientId, companyId);
      } else {
        client = await this.corporateClientService.getById(dto.clientId, companyId);
      }

      if (!client) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('client'));
      }

      if (dto.clientType === 'individualClient') {
        order.corporateClient = null;
        order.individualClient = client as IndividualClient;
      } else {
        order.individualClient = null;
        order.corporateClient = client as CorporateClient;
      }
      order.clientType = dto.clientType;
    }

    if (dto.orderDate) {
      order.orderDate = dto.orderDate;
    }

    if (dto.address) {
      order.address = dto.address;
    }

    if (dto.price) {
      order.price = dto.price;
    }

    if (dto.comment) {
      order.comment = dto.comment;
    }

    if (dto.paymentMethodId) {
      const paymentMethod = await this.paymentMethodService.getById(dto.paymentMethodId, companyId);
      if (!paymentMethod) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('paymentMethod'));
      }

      order.paymentMethod = paymentMethod;
    }

    if (dto.statusId) {
      const status = await this.statusService.getById(dto.statusId, companyId);
      if (!status) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('status'));
      }

      order.status = status;
    }

    if (dto.solutionsIds.length) {
      const solutions = await Promise.all(dto.solutionsIds.map(async (solutionId) => {
        const solution = await this.solutionService.getById(solutionId, companyId);
        if (!solution) {
          throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('solution'));
        }
        return solution;
      }));

      if (!solutions.length) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('solution'));
      }

      order.solutions = solutions;
    }

    if (dto.stuffIds.length) {
      const stuff = await Promise.all(dto.stuffIds.map(async (userId) => {
        const user = await this.userService.getUserById(userId);
        if (!user) {
          throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('stuff'));
        }
        return user;
      }));

      if (!stuff.length) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('stuff'));
      }

      order.stuff = stuff;
    }

    return this.orderRepository.save(order);
  }

  async deleteById(companyId: number, orderId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, orderId, 'order');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const order = company.orders.find(order => order.id === orderId);
    if (!order) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('order'));
    }

    await this.orderRepository.remove(order as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'order');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    company.orders = [];

    await this.entityManager.save(company);

    return true;
  }
}
