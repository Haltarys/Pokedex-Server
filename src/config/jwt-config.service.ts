import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';
import { LaunchConfigService } from './launch-config.service';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    private readonly launchConfigService: LaunchConfigService,
  ) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('jwt.secret'),
      signOptions: {
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      },
      verifyOptions: {
        ignoreExpiration: !this.launchConfigService.isProduction,
      },
    };
  }
}
