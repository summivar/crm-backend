import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCorporateClientDto, EditCorporateClientDto, GetCorporateClientsFilterDto } from './dtos';
import { CorporateClient } from './entity/corporateClient.entity';
import { CompanyService } from '../../company/company.service';
import { EXCEPTION_MESSAGE } from '../../constants';
import { EditPaymentMethodDto } from '../../paymentMethod/dtos';
import { InfoTracerService } from '../../infoTracer/infoTracer.service';
import {
  CompanyNotFoundException,
  CorporateClientAlreadyExistException, CorporateClientNotFoundException,
  InfoTracerNotFoundException
} from './exceptions';

@Injectable()
export class CorporateClientService {
  constructor(
    @InjectRepository(CorporateClient) private corporateClientRepository: Repository<CorporateClient>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService,
    private readonly infoTracerService: InfoTracerService
  ) {
  }

  async getFiltered(dto: GetCorporateClientsFilterDto, companyId: number) {
    const {
      dateFrom,
      dateTo,
      someAddresses,
      infoTracerId
    } = dto;

    let query = this.corporateClientRepository.createQueryBuilder('corporateClient')
      .leftJoinAndSelect('corporateClient.company', 'company')
      .where('company.id = :companyId', {companyId: Number(companyId)});

    if (dateFrom) {
      query = query.andWhere('corporateClient.dateOfCreation >= :dateFrom', {dateFrom});
    }

    if (dateTo) {
      query = query.andWhere('corporateClient.dateOfCreation <= :dateTo', {dateTo});
    }

    if (someAddresses === 'true') {
      query = query.andWhere('array_length(corporateClient.addresses, 1) > 1');
    }

    if (someAddresses === 'false') {
      query = query.andWhere('array_length(corporateClient.addresses, 1) <= 1');
    }

    query = query.leftJoinAndSelect('corporateClient.infoTracer', 'infoTracer');
    if (infoTracerId) {
      query = query.andWhere('infoTracer.id = :infoTracerId', {infoTracerId: Number(infoTracerId)});
    }

    return await query.getManyAndCount();
  }

  async getById(corporateClientId: number, companyId: number) {
    return this.corporateClientRepository
      .createQueryBuilder('corporateClient')
      .leftJoinAndSelect('corporateClient.infoTracer', 'infoTracer')
      .leftJoinAndSelect('corporateClient.company', 'company')
      .where('corporateClient.id = :corporateClientId', {corporateClientId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.corporateClientRepository
      .createQueryBuilder('corporateClient')
      .leftJoinAndSelect('corporateClient.infoTracer', 'infoTracer')
      .leftJoinAndSelect('corporateClient.company', 'company')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreateCorporateClientDto, companyId: number) {
    const client = await this.corporateClientRepository.findOne({
      where: [
        { phone: dto.phone },
        { INN: dto.INN },
        { KPP: dto.KPP }
      ]
    });

    if (client) {
      throw new CorporateClientAlreadyExistException();
    }

    const company = await this.companyService.getCompanyWithEntity(companyId, 'corporateClient');

    if (!company) {
      throw new CompanyNotFoundException()
    }

    const infoTracer = await this.infoTracerService.getById(dto.infoTracerId, companyId);

    if (!infoTracer) {
      throw new InfoTracerNotFoundException();
    }

    const newClient = await this.corporateClientRepository.save({
      phone: dto.phone,
      addresses: dto.addresses,
      dateOfCreation: dto.dateOfCreation,
      name: dto.name,
      KPP: dto.KPP,
      INN: dto.INN,
      infoTracer: infoTracer
    });

    company.corporateClients.push(newClient);

    await this.entityManager.save(company);

    return newClient;
  }

  async edit(dto: EditCorporateClientDto, corporateClientId: number, companyId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, corporateClientId, 'corporateClient');
    if (!company) {
      throw new CompanyNotFoundException()
    }

    const corporateClient = await this.corporateClientRepository.findOne({
      where: {
        id: corporateClientId
      }
    });

    if (!corporateClient) {
      throw new CorporateClientNotFoundException();
    }

    if (dto.phone) {
      corporateClient.phone = dto.phone;
    }

    if (dto.addresses.length) {
      corporateClient.addresses = dto.addresses;
    }

    if (dto.dateOfCreation) {
      corporateClient.dateOfCreation = dto.dateOfCreation;
    }

    if (dto.name) {
      corporateClient.name = dto.name;
    }

    if (dto.INN) {
      corporateClient.INN = dto.INN;
    }

    if (dto.KPP) {
      corporateClient.KPP = dto.KPP;
    }

    if (dto.infoTracerId) {
      const infoTracer = await this.infoTracerService.getById(dto.infoTracerId, companyId);

      if (!infoTracer) {
        throw new InfoTracerNotFoundException();
      }

      corporateClient.infoTracer = infoTracer;
    }

    return this.corporateClientRepository.save(corporateClient);
  }

  async deleteById(companyId: number, corporateClientId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, corporateClientId, 'corporateClient');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const corporateClient = company.corporateClients.find(corporateClient => corporateClient.id === corporateClientId);
    if (!corporateClient) {
      throw new CorporateClientNotFoundException();
    }

    await this.corporateClientRepository.remove(corporateClient as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'corporateClient');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    company.corporateClients = [];

    await this.entityManager.save(company);

    return true;
  }
}
