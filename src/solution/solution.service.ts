import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreateSolutionDto, EditSolutionDto } from './dtos';
import { CompanyService } from '../company/company.service';
import { EXCEPTION_MESSAGE } from '../constants';
import { Solution } from './entities/solution.entity';
import { CompanyNotFoundException, SolutionAlreadyExistException, SolutionNotFoundException } from './exceptions';

@Injectable()
export class SolutionService {
  constructor(
    @InjectRepository(Solution) private readonly solutionRepository: Repository<Solution>,
    private readonly entityManager: EntityManager,
    private readonly companyService: CompanyService
  ) {
  }

  async getById(solutionId: number, companyId: number) {
    return this.solutionRepository
      .createQueryBuilder('solution')
      .leftJoinAndSelect('solution.company', 'company')
      .where('solution.id = :solutionId', {solutionId})
      .andWhere('company.id = :companyId', {companyId})
      .getOne();
  }

  async getAll(companyId: number) {
    return this.solutionRepository
      .createQueryBuilder('solution')
      .leftJoinAndSelect('solution.orders', 'orders')
      .leftJoinAndSelect('solution.company', 'company')
      .where('company.id = :companyId', {companyId})
      .getManyAndCount();
  }

  async create(dto: CreateSolutionDto, companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'solution');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const existingSolution = company.solutions.find(solution => solution.name === dto.name);
    if (existingSolution) {
      throw new SolutionAlreadyExistException();
    }

    const solution = await this.solutionRepository.save({
      name: dto.name,
      price: dto.price,
      costPrice: dto.costPrice,
      difficulty: dto.difficulty,
      comment: dto.comment,
    });

    company.solutions.push(solution);

    await this.entityManager.save(company);

    return solution;
  }

  async edit(dto: EditSolutionDto, solutionId: number, companyId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, solutionId, 'solution');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const solution = await this.solutionRepository.findOne({
      where: {
        id: solutionId
      }
    });

    if (!solution) {
      throw new SolutionNotFoundException();
    }

    if (dto.name) {
      const existingSolution = company.solutions.find(solution => solution.name === dto.name);
      if (existingSolution) {
        throw new SolutionAlreadyExistException();
      }

      solution.name = dto.name;
    }

    if (dto.price) {
      solution.price = dto.price;
    }

    if (dto.costPrice) {
      solution.costPrice = dto.costPrice;
    }

    if (dto.difficulty) {
      solution.difficulty = dto.difficulty;
    }

    if (dto.comment) {
      solution.comment = dto.comment;
    }

    return this.solutionRepository.save(solution);
  }

  async deleteById(companyId: number, solutionId: number) {
    const company = await this.companyService.getCompanyWithEntityId(companyId, solutionId, 'solution');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    const solution = company.solutions.find(solution => solution.id === solutionId);
    if (!solution) {
      throw new SolutionNotFoundException();
    }

    await this.solutionRepository.remove(solution as any);

    return true;
  }

  async deleteAll(companyId: number) {
    const company = await this.companyService.getCompanyWithEntity(companyId, 'solution');
    if (!company) {
      throw new CompanyNotFoundException();
    }

    company.solutions = [];

    await this.entityManager.save(company);

    return true;
  }
}
