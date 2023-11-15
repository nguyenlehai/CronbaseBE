import { Like, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/Register';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getInactiveUsers(): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.isActive = :active', { active: false })
      .getMany();
  }

  async findOne(data): Promise<User> {
    return this.userRepository.findOne(data);
  }

  async update(id: number, data) {
    return this.userRepository.update(id, data);
  }

  async updateByEmail(email: string, data: Partial<User>) {
    return this.userRepository.update({ email }, data);
  }

  async findAllByIsActive(
    page: number,
    size: number,
    keyword: string,
    isActive: number,
  ) {
    let offset = 0;
    let limit = 10;
    if (page && size) {
      offset = (Number(page) - 1) * Number(size);
    }
    if (size) {
      limit = Number(size);
    }
    if (!isActive) {
      isActive = 0;
    }
    const operator: any = {
      take: limit,
      skip: offset,
      where: {
        isActive,
      },
      relations: {
        user_ips: true,
      },
      order: { createdAt: 'DESC' },
    };
    const [result, total] = await this.userRepository.findAndCount(operator);
    return {
      data: result,
      count: total,
    };
  }

  async findAndCount(page: number, size: number, keyword: string) {
    let offset = 0;
    let limit = 10;
    if (page && size) {
      offset = (Number(page) - 1) * Number(size);
    }
    if (size) {
      limit = Number(size);
    }
    const operator: any = {
      take: limit,
      skip: offset,
      where: {},
      order: { createdAt: 'DESC' },
      relations: {
        user_ips: true,
      },
    };
    if (keyword) {
      operator.where = { email: Like('%' + keyword + '%') };
    }
    const [result, total] = await this.userRepository.findAndCount(operator);

    return {
      data: result,
      count: total,
    };
  }

  async create(data: RegisterDto) {
    return this.userRepository.create(data);
  }

  async updateIsActiveUser(data: { email: string; isActive: boolean }) {
    return this.userRepository.update(
      { email: data.email },
      {
        isActive: data.isActive,
      },
    );
  }
}
