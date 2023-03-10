import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from 'src/user/user.schema';
import { UserService } from 'src/user/user.service';
import { JwtPayload } from './dto/jwt-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService)) private userService: UserService,
    private jwtService: JwtService,
  ) {}

  private readonly rounds = 12;

  async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await this.comparePasswords(password, user.password))) {
      return user;
    }
    return null;
  }

  async validateJwt(jwt: string) {
    return this.jwtService.verifyAsync<JwtPayload>(jwt);
  }

  async logIn({ id }: UserDocument) {
    return { jwt: await this.generateJwt(id) };
  }

  async generateJwt(userId: string) {
    return this.jwtService.signAsync({ sub: userId });
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, this.rounds);
  }

  async comparePasswords(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
