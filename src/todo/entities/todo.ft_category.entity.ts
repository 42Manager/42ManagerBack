import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from './todo.account.entity';

@Entity({ name: 'ft_category' })
@Unique(['uid', 'name'])
export class FtCategory {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid' })
  uid: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'is_share' })
  is_share: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
