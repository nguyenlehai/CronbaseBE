import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig({ path: '.env' });

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'tutorial-authentication',
      synchronize: true,
      autoLoadEntities: false,
      entities: ['dist/src/**/*.entity{.ts,.js}', 'src/**/*.entity{.ts,.js}'],
      migrations: [
        'dist/src/database/migrations/*{.ts,.js}',
        'src/database/migrations/*{.ts,.js}',
      ],
    }),
  ],
})
export class DatabaseModule {}
