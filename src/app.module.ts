import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getEnvPath } from './common/helper/env.helper';
import { PokemonModule } from './pokemon/pokemon.module';

const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
console.log(envFilePath);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    PokemonModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
