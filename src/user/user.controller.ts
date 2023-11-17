import {
  Body,
  Controller,
  Post,
  UnauthorizedException,
  Get,
  Query,
  Put,
  Req,
  Request,
} from '@nestjs/common';
// import { JwtAuthGuard } from '../auth/guards/auth.guard';
import { UserService } from './user.service';
import { transformError, transformResponse } from 'src/common/helpers';
import { VerifyEmailDto } from './dto/VerifyEmailDto';
import { RegisterDto } from './dto/Register';
import { IpsService } from 'src/ips/ips.service';
@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly ipsService: IpsService,
  ) {}

  @Post('/register')
  async register(@Body() bodyData: RegisterDto) {
    try {
      await this.userService.register(bodyData);
      return transformResponse({
        data: [],
      });
    } catch (error) {
      return transformError(error);
    }
  }

  @Post('/verify-email')
  async verifyEmail(@Body() bodyData: VerifyEmailDto) {
    try {
      const user = await this.userService.findByEmail(bodyData.email);
      if (!user) {
        throw new UnauthorizedException('Username or password is incorrect');
      }
      return transformResponse({
        data: user,
      });
    } catch (error) {
      return transformError(error);
    }
  }

  @Get('list-block')
  // @UseGuards(JwtAuthGuard)
  async listBlock(
    @Query()
    query: {
      page: number;
      size: number;
      keyword: string;
      isActive: number;
    },
  ) {
    try {
      const listBlockUser = await this.userService.findAllByIsActive(
        query.page,
        query.size,
        query.keyword,
        query.isActive,
      );
      return transformResponse({
        data: listBlockUser,
      });
    } catch (error) {
      return transformError(error);
    }
  }

  @Get('/get-all-user-hainl')
  async findAll(
    @Query() query: { page: number; size: number; keyword: string },
    @Req() request: Request,
  ) {
    try {
      const data = await this.userService.findAllUser(
        query.page,
        query.size,
        query.keyword,
      );
      const ip = request['realIp'];
      console.log(ip);
      return transformResponse({
        data: { ...data },
      });
    } catch (error) {
      return transformError(error);
    }
  }

  @Put('block-user')
  // @UseGuards(JwtAuthGuard)
  async changeActive(@Body() bodyData: { email: string; isActive: boolean }) {
    try {
      await this.userService.updateIsActiveUser(bodyData);
      return transformResponse({
        data: [],
      });
    } catch (error) {
      return transformError(error);
    }
  }

  @Post('status-ip')
  async getStatusIpCurrent(
    @Body() bodyData: { email: string },
    @Req() req: Request,
  ) {
    try {
      console.log(req['realIp']);
      const { email } = bodyData;
      const userExist = await this.userService.findByEmail(email);
      const ipUserExist = await this.ipsService.findOne(
        userExist.id,
        req['realIp'],
      );
      const isBlockIP = !(ipUserExist.count <= 15);
      const data = {
        currentIP: req['realIp'],
        isBlockIP: isBlockIP,
      };
      return transformResponse({
        data,
      });
    } catch (error) {
      return transformError(error);
    }
  }
}
