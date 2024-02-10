import { Test, TestingModule } from '@nestjs/testing';
import { SolutionController } from './solution.controller';

describe('PaymentMethodController', () => {
  let controller: SolutionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SolutionController],
    }).compile();

    controller = module.get<SolutionController>(SolutionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
