import { Body, Controller, Post } from '@nestjs/common';
import { CorporateClientService } from './corporate-client.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateCorporateClientDto } from './dtos';

@ApiTags('Юридические клиенты')
@Controller('corporate-client')
export class CorporateClientController {
  constructor(private corporateClientService: CorporateClientService) {
  }
}
