import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AdminRoute } from 'src/auth/decorators/admin-route.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoute } from 'src/auth/decorators/user-route.decorator';
import { IdParams } from 'src/utils/dto/id.params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './user.schema';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @AdminRoute()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UserRoute()
  @Get('@me')
  findCurrentUser(@CurrentUser() user: UserDocument) {
    return user;
  }

  @UserRoute()
  @Get(':id')
  findOne(@Param() { id }: IdParams) {
    return this.userService.findOne(id);
  }

  @UserRoute()
  @Patch('@me')
  updateCurrentUser(
    @CurrentUser('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @AdminRoute()
  @Patch(':id')
  update(@Param() { id }: IdParams, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @UserRoute()
  @Delete('@me')
  deleteCurrentUser(@CurrentUser('id') id: string) {
    return this.userService.delete(id);
  }

  @AdminRoute()
  @Delete(':id')
  delete(@Param() { id }: IdParams) {
    return this.userService.delete(id);
  }
}
