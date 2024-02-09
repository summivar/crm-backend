import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CompanyService } from './company.service';

@ApiTags('Компании')
@Controller('company')
export class CompanyController {
  constructor(
    private readonly companyService: CompanyService
  ) {
  }

  @ApiOperation({summary: 'Получить все компании'})
  @Get('get/all')
  async getAll() {
    return this.companyService.getAllCompanies();
  }
}
