import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/user.entity';

@Entity('user_ips')
export class IPS_Entity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  count: number;

  @Column({ nullable: true })
  userId: number;

  @ManyToOne(() => User, (user: any) => user.user_ips)
  @JoinColumn({ name: 'userId' })
  user: User;

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

  @Column({ type: 'timestamp', nullable: true })
  deletedAt: Date;
}
