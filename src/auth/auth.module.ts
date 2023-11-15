import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from '../user/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { IpsModule } from 'src/ips/ips.module';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecretKey'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    IpsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [],
})
export class AuthModule {}
