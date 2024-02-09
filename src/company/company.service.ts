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
    return this.companyRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        users: true,
      },
    });
  }

  async deleteAll() {
    return this.companyRepository.delete({});
  }
}
