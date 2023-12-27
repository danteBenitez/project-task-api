import { Logger, Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getConnectionOptions } from '../config';
import { ENVIRONMENT } from 'src/config/env';
import configEnv from 'src/config/env';
import { Role } from 'src/auth/entities/role.entity';
import { User } from 'src/users/entities/user.entity';
import { Project } from 'src/projects/entities/project.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.env.${process.env.NODE_ENV}`, '.env'],
      load: [configEnv],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const dbConfig = config.get<ENVIRONMENT['DB']>('DB');
        return { ...getConnectionOptions(dbConfig), entities: [User, Role, Project] };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [Logger, SeederService],
  exports: [],
})
export class SeederModule {}
