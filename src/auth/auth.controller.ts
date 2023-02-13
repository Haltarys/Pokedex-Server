import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserRoute } from './decorators/user-route.decorator';
import { CredentialsDto } from './dto/credentials.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async logIn(@CurrentUser() user: UserDocument, @Body() _: CredentialsDto) {
    return this.authService.logIn(user);
  }

  @UserRoute()
  @Get('profile')
  getProfile(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UserRoute()
  @Patch('profile')
  updateProfile(
    @CurrentUser('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @UserRoute()
  @Delete('profile')
  deleteProfile(@CurrentUser('id') id: string) {
    return this.userService.remove(id);
  }
}
