import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IndividualClient } from '../entities/individualClient.entity';
import { Repository } from 'typeorm';
import { CreateIndividualClientDto } from './dtos';

@Injectable()
export class IndividualClientService {
  constructor(
    @InjectRepository(IndividualClient) private individualClientRepository: Repository<IndividualClient>
  ) {
  }

  async createClient(dto: CreateIndividualClientDto) {
    const newClient = this.individualClientRepository.create({
      phone: dto.phone,
      addresses: dto.addresses,
      birthday: dto.birthday,
      name: dto.name,
      surname: dto.surname,
      middleName: dto.middleName,
    });
    return this.individualClientRepository.save(newClient);
  }
}
