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
import { IdParams } from 'src/utils/dto/id.params';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @AdminRoute()
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @AdminRoute()
  @Get(':id')
  findOne(@Param() { id }: IdParams) {
    return this.userService.findOne(id);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @AdminRoute()
  @Patch(':id')
  update(@Param() { id }: IdParams, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @AdminRoute()
  @Delete(':id')
  delete(@Param() { id }: IdParams) {
    return this.userService.delete(id);
  }
}
