import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { PokemonModule } from './pokemon/pokemon.module';


@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: getEnvPath(`${__dirname}/common/envs`), isGlobal: true }),
    PokemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
