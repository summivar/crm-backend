import { Test, TestingModule } from '@nestjs/testing';
import { InfoTracerController } from './infoTracer.controller';

describe('InfoTracerController', () => {
  let controller: InfoTracerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InfoTracerController],
    }).compile();

    controller = module.get<InfoTracerController>(InfoTracerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
