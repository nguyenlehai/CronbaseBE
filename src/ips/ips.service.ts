import { UserService } from './../user/user.service';
import { IPS_Entity } from './ips.entity';
import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IpsRepository } from './ips.repository';
@Injectable()
export class IpsService {
  constructor(
    private readonly repository: IpsRepository,
    private dataSource: DataSource,
    private readonly userService: UserService,
  ) {}

  findOne(userId: number, ip: string): Promise<IPS_Entity | null> {
    return this.repository.findOne({
      where: {
        userId: userId,
        name: ip,
      },
    });
  }

  async create(body: { name: string; userId: number }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newIpsUser: any = await this.repository.create({
        name: body.name,
        userId: body.userId,
        count: 1,
      });
      await queryRunner.manager.save(IPS_Entity, newIpsUser);
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(body: { count: number; userId: number }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.repository.update(body.userId, { count: body.count });
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
