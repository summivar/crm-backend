import { Test, TestingModule } from '@nestjs/testing';
import { CorporateClientService } from './corporate-client.service';

describe('CorporateClientService', () => {
  let service: CorporateClientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CorporateClientService],
    }).compile();

    service = module.get<CorporateClientService>(CorporateClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
