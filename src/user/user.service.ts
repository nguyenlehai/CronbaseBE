import { DataSource, Like } from 'typeorm';
import { SendOtpDto } from './dto/SendOtpDto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/Register';
import { IpsService } from 'src/ips/ips.service';

@Injectable()
export class UserService {
  constructor(
    private readonly repository: UserRepository,
    private dataSource: DataSource,
    private ipsService: IpsService,
  ) {}
  findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  findById(id: number): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  getInactiveUsers(): Promise<User[]> {
    return this.repository.getInactiveUsers();
  }

  update(userId: number, data) {
    return this.repository.update(userId, data);
  }

  updateByEmail(body: SendOtpDto, ip: string) {
    const { email, otp } = body;
    return this.repository.updateByEmail(email, { otp, ip });
  }

  findAllByIsActive(
    page: number,
    size: number,
    keyword: string,
    isActive: number,
  ): Promise<any> {
    return this.repository.findAllByIsActive(page, size, keyword, isActive);
  }

  findAllUser(page: number, size: number, keyword: string): Promise<any> {
    return this.repository.findAndCount(page, size, keyword);
  }

  async register(body: RegisterDto): Promise<void | any> {
    const {
      email,
      password,
      firstName,
      lastName,
      otp,
      twofa,
      ip,
      timeLogin,
    }: RegisterDto = body;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const newUser = await this.repository.create({
        email: email,
        password: password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        otp,
        twofa,
        ip,
        timeLogin,
      });
      await queryRunner.manager.save(User, newUser);
      await queryRunner.commitTransaction();
      return newUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async updateIsActiveUser(body: { email: string; isActive: boolean }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const { email, isActive } = body;
      const userExist = await this.repository.findOne({
        where: {
          email: Like(email),
        },
      });
      if (!userExist) {
        throw new Error('Email is not exist!');
      }
      await this.repository.updateIsActiveUser({
        email,
        isActive,
      });

      const ipUserExist = await this.ipsService.findOneByData({
        where: {
          userId: userExist.id,
        },
      });
      const listUserId = await this.ipsService.findAllByData({
        where: {
          name: ipUserExist.name,
        },
      });
      // update active for user not login other 15
      for (const value of listUserId) {
        if (value.count <= 15) {
          this.repository.update(value.userId, {
            isActive: isActive,
          });
        }
      }
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  generatePassword(password: string): string {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  }

  // // Example method to retrieve soft-deleted entity by id
  // async getSoftDeletedEntityById(id: number): Promise<User | undefined> {
  //   return this.yourEntityRepository
  //     .createQueryBuilder('entity')
  //     .withDeleted() // Include soft-deleted entities
  //     .where('entity.id = :id', { id })
  //     .getOne();
  // }

  // // Example method to restore soft-deleted entity by id
  // async restoreSoftDeletedEntityById(id: number): Promise<DeleteResult> {
  //   return this.yourEntityRepository
  //     .createQueryBuilder()
  //     .restore() // Restore soft-deleted entity
  //     .update(YourEntity)
  //     .set({ deletedAt: null }) // Set deletedAt to null to restore
  //     .where('id = :id', { id })
  //     .execute();
  // }
}
