import {
  //   Get,
  //   Inject,
  //   Patch,
  //   Query,
  //   Req,
  //   Res,
  Request,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { transformResponse } from 'src/common/helpers';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-in')
  @UseGuards(LocalAuthGuard)
  async signIn(@Request() request: Request) {
    try {
      const ip = request['realIp'];
      console.log(ip);
      const data = await this.authService.generateJwtToken(request['user'], ip);
      return transformResponse({
        data: {
          ...data,
          userId: request['user'].id,
        },
      });
    } catch (error) {}
  }
}
