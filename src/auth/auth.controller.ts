import { Body, Controller, Post } from '@nestjs/common';
import type { UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginRoute } from './decorators/login.decorator';
import type { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @LoginRoute()
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logIn(@CurrentUser() user: UserDocument, @Body() _: CredentialsDto) {
    return this.authService.logIn(user);
  }
}
