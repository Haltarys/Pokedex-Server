import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { LaunchConfigService } from 'src/config/launch-config.service';
import { UserService } from 'src/user/user.service';
import type { JwtPayload } from '../dto/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private userService: UserService,
    private configService: ConfigService,
    private launchConfigService: LaunchConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: !launchConfigService.isProduction,
      secretOrKey: configService.get<string>('jwt.secret'),
    });
  }

  async validate({ sub }: JwtPayload) {
    return this.userService.findOne(sub);
  }
}
