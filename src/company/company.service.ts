import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';
import { EXCEPTION_MESSAGE } from '../constants';

export type EntityType = 'order' | 'solution' | 'paymentMethod' | 'status' | 'infoTracer' | 'individualClient' | 'corporateClient';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {
  }

  async getAllCompanies() {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.infoTracers', 'infoTracers')
      .leftJoinAndSelect('company.statuses', 'statuses')
      .leftJoinAndSelect('company.paymentMethods', 'paymentMethods')
      .leftJoinAndSelect('company.users', 'users')
      .leftJoinAndSelect('company.solutions', 'solutions')
      .leftJoinAndSelect('company.orders', 'orders')
      .leftJoinAndSelect('company.individualClients', 'individualClients')
      .leftJoinAndSelect('company.corporateClients', 'corporateClients')
      .getManyAndCount();
  }

  async getCompanyById(id: number) {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'users')
      .where('company.id = :id', {id})
      .getOne();
  }

  async getCompanyWithEntityId(companyId: number, entityId: number, entityType: EntityType) {
    let relation: string;

    switch (entityType) {
      case 'order':
        relation = 'company.orders';
        break;
      case 'solution':
        relation = 'company.solutions';
        break;
      case 'paymentMethod':
        relation = 'company.paymentMethods';
        break;
      case 'status':
        relation = 'company.statuses';
        break;
      case 'infoTracer':
        relation = 'company.infoTracers';
        break;
      case 'corporateClient':
        relation = 'company.corporateClients';
        break;
      case 'individualClient':
        relation = 'company.individualClients';
        break;
      default:
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }

    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect(relation, 'entity')
      .where('entity.id = :entityId', {entityId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getCompanyWithEntity(companyId: number, entityType: EntityType) {
    let relation: string;

    switch (entityType) {
      case 'order':
        relation = 'company.orders';
        break;
      case 'solution':
        relation = 'company.solutions';
        break;
      case 'paymentMethod':
        relation = 'company.paymentMethods';
        break;
      case 'status':
        relation = 'company.statuses';
        break;
      case 'infoTracer':
        relation = 'company.infoTracers';
        break;
      case 'corporateClient':
        relation = 'company.corporateClients';
        break;
      case 'individualClient':
        relation = 'company.individualClients';
        break;
      default:
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.INVALID_DATA);
    }

    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect(relation, 'entity')
      .where('company.id = :companyId', { companyId })
      .getOne();
  }

  async deleteAll() {
    return this.companyRepository.delete({});
  }

  async save(company: Partial<Company>) {
    return this.companyRepository.save(company);
  }
}
