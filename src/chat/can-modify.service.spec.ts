import { Test, TestingModule } from '@nestjs/testing';
import { CanModifyService } from './can-modify.service';

describe('CanModifyService', () => {
  let service: CanModifyService;

  beforeEach(async () => {
    const mockCanModifyService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanModifyService],
    })
      .overrideProvider(CanModifyService)
      .useValue(mockCanModifyService)
      .compile();

    service = module.get<CanModifyService>(CanModifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
