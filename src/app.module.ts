import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { CustomConfigModule } from './config/custom-config.module';
import { MongooseConfigService } from './config/mongoose-config.service';
import { MigrationRunnerModule } from './migration-runner/migration-runner.module';
import { PokemonModule } from './pokemon/pokemon.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    CustomConfigModule,
    MongooseModule.forRootAsync({ useClass: MongooseConfigService }),
    PokemonModule,
    UserModule,
    AuthModule,
    ChatModule,
    MigrationRunnerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
