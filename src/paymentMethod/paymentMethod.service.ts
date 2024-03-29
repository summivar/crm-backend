import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePaymentMethodDto, EditPaymentMethodDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { PaymentMethod } from './entities/paymentMethod.entity';
import {
  CompanyNotFoundException,
  PaymentMethodAlreadyExistException,
  PaymentMethodNotFoundException
} from './exceptions';

@Injectable()
export class PaymentMethodService {
  constructor(
    @InjectRepository(PaymentMethod) private readonly paymentMethodRepository: Repository<PaymentMethod>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService
  ) {
  }

  async getById(paymentMethodId: number, companyId: number) {
    return this.paymentMethodRepository
      .createQueryBuilder('paymentMethod')
      .leftJoinAndSelect('paymentMethod.company', 'company')
      .where('paymentMethod.id = :paymentMethodId', {paymentMethodId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.paymentMethodRepository
      .createQueryBuilder('paymentMethod')
      .leftJoinAndSelect('paymentMethod.company', 'company')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreatePaymentMethodDto, companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'paymentMethod');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const existingPaymentMethod = company.paymentMethods.find(paymentMethod => paymentMethod.name === dto.name);
    if (existingPaymentMethod) {
      throw new PaymentMethodAlreadyExistException();
    }

    const paymentMethod = await this.paymentMethodRepository.save({
      name: dto.name
    });

    company.paymentMethods.push(paymentMethod);

    await this.entityManager.save(company);

    return paymentMethod;
  }

  async edit(dto: EditPaymentMethodDto, paymentMethodId: number, companyId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, paymentMethodId, 'paymentMethod');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const paymentMethod = await this.paymentMethodRepository.findOne({
      where: {
        id: paymentMethodId
      }
    });

    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException();
    }

    if (dto.name) {
      const existingPaymentMethod = company.paymentMethods.find(paymentMethod => paymentMethod.name === dto.name);
      if (existingPaymentMethod) {
        throw new PaymentMethodNotFoundException();
      }

      paymentMethod.name = dto.name;
    }

    return this.paymentMethodRepository.save(paymentMethod);
  }

  async deleteById(companyId: number, paymentMethodId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, paymentMethodId, 'paymentMethod');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const paymentMethod = company.paymentMethods.find(paymentMethod => paymentMethod.id === paymentMethodId);
    if (!paymentMethod) {
      throw new PaymentMethodNotFoundException();
    }

    await this.paymentMethodRepository.remove(paymentMethod as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'paymentMethod');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    company.paymentMethods = [];

    await this.entityManager.save(company);

    return true;
  }
}
