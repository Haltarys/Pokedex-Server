import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from './jwt.config';
import { LaunchConfigService } from './launch-config.service';
import { MongooseConfigService } from './mongoose-config.service';

@Global()
@Module({
  imports: [ConfigModule.forRoot({ load: [jwtConfig] })],
  providers: [LaunchConfigService, MongooseConfigService],
  exports: [ConfigModule, LaunchConfigService, MongooseConfigService],
})
export class CustomConfigModule {}
