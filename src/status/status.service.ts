import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto, EditStatusDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { CompanyNotFoundException, StatusAlreadyExistException, StatusNotFoundException } from './exceptions';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status) private readonly statusRepository: Repository<Status>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService
  ) {
  }

  async getById(statusId: number, companyId: number) {
    return this.statusRepository
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.company', 'company')
      .where('status.id = :statusId', {statusId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.statusRepository
      .createQueryBuilder('status')
      .leftJoinAndSelect('status.orders', 'orders')
      .leftJoinAndSelect('status.company', 'company')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreateStatusDto, companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'status');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const existingStatus = company.statuses.find(status => status.name === dto.name);
    if (existingStatus) {
      throw new StatusAlreadyExistException();
    }

    const status = await this.statusRepository.save({
      name: dto.name,
      color: dto.color
    });

    company.statuses.push(status);

    await this.entityManager.save(company);

    return status;
  }

  async edit(dto: EditStatusDto, statusId: number, companyId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, statusId, 'status');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const status = await this.statusRepository.findOne({
      where: {
        id: statusId
      }
    });

    if (!status) {
      throw new StatusNotFoundException();
    }

    if (dto.name) {
      const existingStatus = company.statuses.find(status => status.name === dto.name);
      if (existingStatus) {
        throw new StatusAlreadyExistException();
      }

      status.name = dto.name;
    }

    if (dto.color) {
      status.color = dto.color;
    }

    return this.statusRepository.save(status);
  }

  async deleteById(companyId: number, statusId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, statusId, 'status');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const status = company.solutions.find(status => status.id === statusId);
    if (!status) {
      throw new StatusNotFoundException();
    }

    await this.statusRepository.remove(status as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'status');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    company.statuses = [];

    await this.entityManager.save(company);

    return true;
  }
}
