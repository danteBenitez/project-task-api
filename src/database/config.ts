import { DataSource, DataSourceOptions } from 'typeorm';
import getEnvConfig, { ENVIRONMENT } from '../config/env';
import { User } from './entities/user.entity';

export function getConnectionOptions(envConfig: ENVIRONMENT['DB']) {
  // If DB_URL is provided, then connect with that.
  // Otherwise, use the other environment variables.
  if (envConfig.HAS_URL) {
    return {
      type: envConfig.DIALECT,
      url: envConfig.URL,
      synchronize: true,
      migrations: ['src/database/migrations/*.ts'],
      entities: [User],
      logging: true,
    } as DataSourceOptions;
  }

  const configWithoutUrl = envConfig as unknown as ENVIRONMENT['DB'] & {
    HAS_URL: false;
  };

  return {
    type: envConfig.DIALECT,
    host: configWithoutUrl.HOST,
    port: configWithoutUrl.PORT,
    username: configWithoutUrl.USER,
    password: configWithoutUrl.PASSWORD,
    database: configWithoutUrl.NAME,
    migrations: ['src/database/migrations/*.ts'],
    entities: [User],
    logging: true,
  } as DataSourceOptions;
}

const options = getConnectionOptions(getEnvConfig()['DB']);

// We define the datasource instance here
// outside of NestJS module system, so the TypeORM CLI can import it.
export const datasource = new DataSource(options);
