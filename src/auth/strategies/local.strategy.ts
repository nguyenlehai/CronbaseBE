import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    });
  }

  async validate(request: any, email: string, password: string): Promise<any> {
    const otp = request.body.otp;
    const twofa = request.body.twofa;
    const ip = request['realIp'];
    return this.authService.validateUser(email, password, otp, ip, twofa);
  }
}
