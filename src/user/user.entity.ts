import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { IPS_Entity } from 'src/ips/ips.entity';

@Entity({ name: 'users' })
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Unique(['email'])
  @Column()
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @Column({ nullable: true, default: null })
  firstName: string;

  @Column({ nullable: true, default: null })
  lastName: string;

  @Column({ nullable: true, default: null })
  ip: string;

  @Column({ nullable: true, default: null })
  otp: string;

  @Column({ nullable: true, default: null })
  isActive: boolean;

  @Column({ nullable: true, default: 0 })
  count: number;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  public createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  public updatedAt: Date;

  constructor(partial: Partial<User>) {
    super();
    Object.assign(this, partial);
  }

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @OneToMany(() => IPS_Entity, (ipsEntity) => ipsEntity.user)
  user_ips: IPS_Entity[];
}
