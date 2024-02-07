import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CorporateClient } from '../entities/corporateClient.entity';
import { CreateCorporateClientDto } from './dtos';

@Injectable()
export class CorporateClientService {
  constructor(
    @InjectRepository(CorporateClient) private corporateClientRepository: Repository<CorporateClient>
  ) {
  }

  async createClient(dto: CreateCorporateClientDto) {
    const newClient = this.corporateClientRepository.create({
      phone: dto.phone,
      addresses: dto.addresses,
      dateOfCreation: dto.dateOfCreation,
      name: dto.name,
      KPP: dto.KPP
    });
    return this.corporateClientRepository.save(newClient);
  }
}
