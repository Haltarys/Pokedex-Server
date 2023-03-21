import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const mockAuthService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
