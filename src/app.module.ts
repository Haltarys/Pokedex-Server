import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import jwtConfig from './config/jwt.config';
import { LaunchConfigService } from './config/launch-config.service';
import { MongooseConfigService } from './config/mongoose-config.service';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [jwtConfig] }),
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    PokemonModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, LaunchConfigService],
})
export class AppModule {}
