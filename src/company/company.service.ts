import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from './entities/company.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company) private companyRepository: Repository<Company>,
  ) {
  }

  async getCompanyById(id: number) {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'users')
      .select([
        'company.id',
        'company.signUpManagerString',
        'company.signUpCleanerString',
        'company.signUpDriverString',
        'company.createdAt',
        'company.updatedAt',
        'users.id',
        'users.name',
        'users.role',
      ])
      .where('company.id = :id', {id})
      .getOne();
  }

  async deleteAll() {
    return this.companyRepository.delete({});
  }

  async save(company: Partial<Company>) {
    return this.companyRepository.save(company);
  }

  async getAllCompanies() {
    return this.companyRepository
      .createQueryBuilder('company')
      .leftJoinAndSelect('company.users', 'users')
      .select([
        'company.id',
        'company.signUpManagerString',
        'company.signUpCleanerString',
        'company.signUpDriverString',
        'company.createdAt',
        'company.updatedAt',
        'users.id',
        'users.name',
        'users.role',
      ])
      .getManyAndCount();
  }
}
