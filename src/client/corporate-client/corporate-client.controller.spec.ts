import { Test, TestingModule } from '@nestjs/testing';
import { CorporateClientController } from './corporate-client.controller';

describe('CorporateClientController', () => {
  let controller: CorporateClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CorporateClientController],
    }).compile();

    controller = module.get<CorporateClientController>(CorporateClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
