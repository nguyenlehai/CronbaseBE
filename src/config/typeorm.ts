import { registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';

dotenvConfig({ path: '.env' });
const config = {
  type: 'mysql',
  host: `${process.env.DATABASE_HOST}`,
  port: `${process.env.DATABASE_PORT}`,
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_DB_NAME}`,
  // entities: ['src/**/*.entity{.ts,.js}'],
  entities: ['**/*.entity{ .ts,.js}'],
  migrations: ['**/migrations/*{ .ts,.js}'],
  seeds: [__dirname + '**/seeds/*{ .ts,.js}'],
  autoLoadEntities: false,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
