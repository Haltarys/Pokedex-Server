import { Test, TestingModule } from '@nestjs/testing';
import { CanModifyService } from './can-modify.service';

describe('CanModifyService', () => {
  let service: CanModifyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CanModifyService],
    }).compile();

    service = module.get<CanModifyService>(CanModifyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
