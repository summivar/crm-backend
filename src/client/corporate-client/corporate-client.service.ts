import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateCorporateClientDto, EditCorporateClientDto } from './dtos';
import { CorporateClient } from './entity/corporateClient.entity';
import { CompanyService } from '../../company/company.service';
import { EXCEPTION_MESSAGE } from '../../constants';
import { EditPaymentMethodDto } from '../../paymentMethod/dtos';
import { InfoTracerService } from '../../infoTracer/infoTracer.service';

@Injectable()
export class CorporateClientService {
  constructor(
    @InjectRepository(CorporateClient) private corporateClientRepository: Repository<CorporateClient>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService,
    private readonly infoTracerService: InfoTracerService
  ) {
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
    const company = await this.companyService.getCompanyWithEntity(companyId, 'corporateClient');

    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('company'));
    }

    const infoTracer = await this.infoTracerService.getById(dto.infoTracerId, companyId);

    if (!infoTracer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('infoTracer'));
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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('company'));
    }

    const corporateClient = await this.corporateClientRepository.findOne({
      where: {
        id: corporateClientId
      }
    });

    if (!corporateClient) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('corporateClient'));
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
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('infoTracer'));
      }

      corporateClient.infoTracer = infoTracer;
    }

    return this.corporateClientRepository.save(corporateClient);
  }

  async deleteById(companyId: number, corporateClientId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, corporateClientId, 'corporateClient');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const corporateClient = company.corporateClients.find(corporateClient => corporateClient.id === corporateClientId);
    if (!corporateClient) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('corporateClient'));
    }

    await this.corporateClientRepository.remove(corporateClient as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'corporateClient');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    company.corporateClients = [];

    await this.entityManager.save(company);

    return true;
  }
}
