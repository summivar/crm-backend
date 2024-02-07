import { Body, Controller, Post } from '@nestjs/common';
import { IndividualClientService } from './individual-client.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateIndividualClientDto } from './dtos';

@ApiTags('Индивидуальные клиенты')
@Controller('individual-client')
export class IndividualClientController {
  constructor(private individualClientService: IndividualClientService) {
  }
}
