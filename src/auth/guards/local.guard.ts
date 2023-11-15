import { AuthGuard } from '@nestjs/passport';
import { Injectable } from '@nestjs/common/decorators';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
