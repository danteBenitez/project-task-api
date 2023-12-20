import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configEnv, { ENVIRONMENT } from './config/env';
import { getConnectionOptions } from './database/config';
import { IsUniqueConstraint } from './decorators/unique.decorator';
import { ProjectsModule } from './projects/projects.module';
import { UsersModule } from './users/users.module';
import { ExistsConstraint } from './decorators/exists.decorator';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [configEnv],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbConfig = configService.get<ENVIRONMENT['DB']>('DB');
        return getConnectionOptions(dbConfig);
      },
      inject: [ConfigService],
    }),
    ProjectsModule,
    UsersModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, IsUniqueConstraint, ExistsConstraint],
})
export class AppModule {}
