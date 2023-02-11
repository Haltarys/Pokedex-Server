import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UserDocument } from 'src/user/user.schema';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { CredentialsDto } from './dto/credentials.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logIn(@CurrentUser() user: UserDocument, @Body() _: CredentialsDto) {
    return this.authService.logIn(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@CurrentUser() user: UserDocument) {
    return user;
  }
}
