import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { LoggerModule } from './logger/logger.module';
import appConfig from '@config/app.config';
import databaseConfig from '@config/database.config';
import authConfig from '@config/auth.config';
import typeorm from './config/typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/user.entity';
import { UserModule } from './user/user.module';
import { IpsModule } from './ips/ips.module';
import { AppLoggerMiddleware } from './middlewares/logger';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, authConfig, typeorm],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('typeorm'),
    }),
    TypeOrmModule.forFeature([User]),
    LoggerModule,
    AuthModule,
    UserModule,
    IpsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(AppLoggerMiddleware).forRoutes('*');
  }
}
