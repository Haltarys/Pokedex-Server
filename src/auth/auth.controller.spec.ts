import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const mockAuthService = {};
    const mockUserService = {};
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UserService],
      controllers: [AuthController],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .overrideProvider(UserService)
      .useValue(mockUserService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
