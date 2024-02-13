import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateIndividualClientDto, EditIndividualClientDto } from './dtos';
import { IndividualClient } from './entity/individualClient.entity';
import { CompanyService } from '../../company/company.service';
import { InfoTracerService } from '../../infoTracer/infoTracer.service';
import { EXCEPTION_MESSAGE } from '../../constants';

@Injectable()
export class IndividualClientService {
  constructor(
    @InjectRepository(IndividualClient) private individualClientRepository: Repository<IndividualClient>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService,
    private readonly infoTracerService: InfoTracerService
  ) {
  }

  async getById(individualClientId: number, companyId: number) {
    return this.individualClientRepository
      .createQueryBuilder('individualClient')
      .leftJoinAndSelect('individualClient.infoTracer', 'infoTracer')
      .leftJoinAndSelect('individualClient.company', 'company')
      .where('individualClient.id = :individualClientId', {individualClientId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.individualClientRepository
      .createQueryBuilder('individualClient')
      .leftJoinAndSelect('individualClient.infoTracer', 'infoTracer')
      .leftJoinAndSelect('individualClient.company', 'company')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreateIndividualClientDto, companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'individualClient');

    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('company'));
    }

    const infoTracer = await this.infoTracerService.getById(dto.infoTracerId, companyId);

    if (!infoTracer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('infoTracer'));
    }

    const newClient = await this.individualClientRepository.save({
      phone: dto.phone,
      addresses: dto.addresses,
      birthday: dto.birthday,
      name: dto.name,
      surname: dto.surname,
      middleName: dto.middleName,
      infoTracer: infoTracer,
    });

    company.individualClients.push(newClient);

    await this.entityManager.save(company);

    return newClient;
  }

  async edit(dto: EditIndividualClientDto, individualClientId: number, companyId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, individualClientId, 'individualClient');

    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('company'));
    }

    const individualClient = await this.individualClientRepository.findOne({
      where: {
        id: individualClientId
      }
    });

    if (!individualClient) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('individualClient'));
    }

    if (dto.name) {
      individualClient.name = dto.name;
    }

    if (dto.surname) {
      individualClient.surname = dto.surname;
    }

    if (dto.middleName) {
      individualClient.middleName = dto.middleName;
    }

    if (dto.birthday) {
      individualClient.birthday = dto.birthday;
    }

    if (dto.infoTracerId) {
      const infoTracer = await this.infoTracerService.getById(dto.infoTracerId, companyId);

      if (!infoTracer) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('infoTracer'));
      }

      individualClient.infoTracer = infoTracer;
    }

    return this.individualClientRepository.save(individualClient);
  }

  async deleteById(companyId: number, individualClientId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, individualClientId, 'individualClient');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const individualClient = company.corporateClients.find(individualClient => individualClient.id === individualClientId);
    if (!individualClient) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID('individualClient'));
    }

    await this.individualClientRepository.remove(individualClient as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'individualClient');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    company.individualClients = [];

    await this.entityManager.save(company);

    return true;
  }
}
