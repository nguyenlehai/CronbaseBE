import { UserModule } from 'src/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { IPS_Entity } from './ips.entity';
import { IpsService } from './ips.service';
import { IpsRepository } from './ips.repository';

@Module({
  imports: [TypeOrmModule.forFeature([IPS_Entity]), UserModule],
  controllers: [],
  providers: [IpsService, IpsRepository],
  exports: [IpsService],
})
export class IpsModule {}
