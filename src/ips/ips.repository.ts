import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IPS_Entity } from './ips.entity';

@Injectable()
export class IpsRepository {
  constructor(
    @InjectRepository(IPS_Entity)
    private readonly ipsRepository: Repository<IPS_Entity>,
  ) {}

  async findOne(data): Promise<any> {
    return this.ipsRepository.findOne(data);
  }

  async create(data) {
    return this.ipsRepository.create(data);
  }

  async update(id: number, data) {
    return this.ipsRepository.update({ userId: id }, data);
  }
}
