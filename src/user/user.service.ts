import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './user.schema';
import { stripPassword } from './utils';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel
      .find()
      .exec()
      .then((users) => users.map(stripPassword));
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findById(id)
      .exec()
      .then((user) => (user ? stripPassword(user) : null));
  }

  async findOneByEmail(email: string): Promise<UserDocument | null> {
    // Here, we do need to return the password hash
    return this.userModel.findOne({ email }).exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    createUserDto.password = await this.authService.hashPassword(
      createUserDto.password,
    );
    const user = new this.userModel(createUserDto);

    return user.save().then(stripPassword);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec()
      .then((user) => (user ? stripPassword(user) : null));
  }

  async remove(id: string): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndDelete(id)
      .exec()
      .then((user) => (user ? stripPassword(user) : null));
  }
}
