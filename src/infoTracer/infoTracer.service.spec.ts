import { Test, TestingModule } from '@nestjs/testing';
import { InfoTracerService } from './infoTracer.service';

describe('InfoTracerService', () => {
  let service: InfoTracerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InfoTracerService],
    }).compile();

    service = module.get<InfoTracerService>(InfoTracerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
