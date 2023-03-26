import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument, UserWithPasswordDocument } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly authService: AuthService,
  ) {}

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id).exec();
  }

  async findOneByEmail(
    email: string,
  ): Promise<UserWithPasswordDocument | null> {
    // Here, we do need to return the password hash
    return this.userModel
      .findOne<UserWithPasswordDocument>({ email })
      .select('password')
      .exec();
  }

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user = new this.userModel({
      ...createUserDto,
      password: await this.authService.hashPassword(createUserDto.password),
    });

    return user.save().then((user) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...rest } = user.toObject();
      return rest as UserDocument;
    });
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    return this.userModel
      .findByIdAndDelete(id)
      .exec()
      .then((user) => !!user);
  }
}
