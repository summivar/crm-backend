import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateInfoTracerDto, EditInfoTracerDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { EXCEPTION_MESSAGE } from '../constants';
import { InfoTracer } from './entities/infoTracer.entity';

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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const existingInfoTracer = company.infoTracers.find(infoTracer => infoTracer.name === dto.name);
    if (existingInfoTracer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
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
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    const infoTracer = await this.infoTracerRepository.findOne({
      where: {
        id: infoTracerId
      }
    });

    if (dto.name) {
      const existingInfoTracer = company.infoTracers.find(infoTracer => infoTracer.name === dto.name);
      if (existingInfoTracer) {
        throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.ALREADY_EXISTS);
      }

      infoTracer.name = dto.name;
    }

    return this.infoTracerRepository.save(infoTracer);
  }

  async deleteById(companyId: number, infoTracerId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, infoTracerId, 'infoTracer');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    const infoTracer = company.infoTracers.find(infoTracer => infoTracer.id === infoTracerId);
    if (!infoTracer) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND_BY_ID);
    }

    await this.infoTracerRepository.remove(infoTracer as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'infoTracer');
    if (!company) {
      throw new BadRequestException(EXCEPTION_MESSAGE.BAD_REQUEST_EXCEPTION.NOT_FOUND);
    }

    company.infoTracers = [];

    await this.entityManager.save(company);

    return true;
  }
}
