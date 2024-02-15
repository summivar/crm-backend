import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateInfoTracerDto, EditInfoTracerDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { InfoTracer } from './entities/infoTracer.entity';
import { CompanyNotFoundException, InfoTracerAlreadyExistException, InfoTracerNotFoundException } from './exceptions';

@Injectable()
export class InfoTracerService {
  constructor(
    @InjectRepository(InfoTracer) private readonly infoTracerRepository: Repository<InfoTracer>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService
  ) {
  }

  async getById(infoTracerId: number, companyId: number) {
    return this.infoTracerRepository
      .createQueryBuilder('infoTracer')
      .leftJoinAndSelect('infoTracer.company', 'company')
      .leftJoinAndSelect('infoTracer.individualClients', 'individualClients')
      .leftJoinAndSelect('infoTracer.corporateClients', 'corporateClients')
      .where('infoTracer.id = :infoTracerId', {infoTracerId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.infoTracerRepository
      .createQueryBuilder('infoTracer')
      .leftJoinAndSelect('infoTracer.company', 'company')
      .leftJoinAndSelect('infoTracer.individualClients', 'individualClients')
      .leftJoinAndSelect('infoTracer.corporateClients', 'corporateClients')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreateInfoTracerDto, companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'infoTracer');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const existingInfoTracer = company.infoTracers.find(infoTracer => infoTracer.name === dto.name);
    if (existingInfoTracer) {
      throw new InfoTracerAlreadyExistException();
    }

    const infoTracer = await this.infoTracerRepository.save({
      name: dto.name
    });

    company.infoTracers.push(infoTracer);

    await this.entityManager.save(company);

    return infoTracer;
  }

  async edit(dto: EditInfoTracerDto, infoTracerId: number, companyId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, infoTracerId, 'infoTracer');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const infoTracer = await this.infoTracerRepository.findOne({
      where: {
        id: infoTracerId
      }
    });

    if (!infoTracer) {
      throw new InfoTracerNotFoundException();
    }

    if (dto.name) {
      const existingInfoTracer = company.infoTracers.find(infoTracer => infoTracer.name === dto.name);
      if (existingInfoTracer) {
        throw new InfoTracerAlreadyExistException();
      }

      infoTracer.name = dto.name;
    }

    return this.infoTracerRepository.save(infoTracer);
  }

  async deleteById(companyId: number, infoTracerId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, infoTracerId, 'infoTracer');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const infoTracer = company.infoTracers.find(infoTracer => infoTracer.id === infoTracerId);
    if (!infoTracer) {
      throw new InfoTracerNotFoundException();
    }

    await this.infoTracerRepository.remove(infoTracer as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'infoTracer');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    company.infoTracers = [];

    await this.entityManager.save(company);

    return true;
  }

}
