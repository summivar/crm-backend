import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto, EditStatusDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { EXCEPTION_MESSAGE } from '../constants';

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
      .leftJoinAndSelect('status.orders', 'orders')
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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const existingStatus = company.statuses.find(status => status.name === dto.name);
    if (existingStatus) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const status = await this.statusRepository.findOne({
      where: {
        id: statusId
      }
    });

    if (dto.name) {
      const existingStatus = company.statuses.find(status => status.name === dto.name);
      if (existingStatus) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const status = company.solutions.find(status => status.id === statusId);
    if (!status) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    await this.statusRepository.remove(status as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'status');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    company.statuses = [];

    await this.entityManager.save(company);

    return true;
  }
}
