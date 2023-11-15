import { IpsService } from './../ips/ips.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './../user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../user/user.entity';
import { DataSource } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly ipsService: IpsService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private dataSource: DataSource,
  ) {}

  async validateUser(
    email: string,
    password: string,
    otp: string | undefined | null,
    ip: string,
  ): Promise<User> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const user = await this.userService.findByEmail(email);
      if (!user) {
        const newUser = await this.userService.register({
          firstName: '',
          lastName: '',
          otp,
          email,
          password,
        });
        await this.ipsService.create({
          userId: newUser.id,
          name: ip,
        });
        return newUser;
      } else {
        const isPasswordCorrect = await this.comparePassword(
          password,
          user.password,
        );
        if (otp?.length === 6) {
          await this.userService.update(user.id, { otp: otp, ip: ip });
        } else if (otp?.length >= 1) {
          throw new UnauthorizedException('Invalid OTP format');
        }
        if (!isPasswordCorrect) {
          throw new UnauthorizedException('Email or password is incorrect');
        } else {
          // update ip in table ips
          const IPSExist = await this.ipsService.findOne(user.id, ip);
          if (IPSExist) {
            if (IPSExist.count >= 15) {
              await this.userService.update(user.id, {
                isActive: 0,
              });
              throw new UnauthorizedException('Account is block');
            } else {
              const count = Number(IPSExist.count) + 1;
              await this.ipsService.update({
                userId: user.id,
                count: count,
              });
            }
          } else {
            await this.ipsService.create({
              userId: user.id,
              name: ip,
            });
          }
        }
      }

      await queryRunner.commitTransaction();
      return user;
    } catch (error) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async generateJwtToken(
    user: User,
    ip: string,
  ): Promise<{ accessToken: string }> {
    const payload = {
      email: user.email,
      id: user.id,
    };
    await this.userService.update(user.id, { ip });
    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>('jwtExpiresIn'),
      }),
    };
  }

  async comparePassword(
    bodyPassword: string,
    passwordDb: string,
  ): Promise<boolean> {
    return bodyPassword === passwordDb;
  }
}
