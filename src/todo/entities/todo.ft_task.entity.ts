import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
} from 'typeorm';
import { FtCategory } from './todo.ft_category.entity';
import { Account } from 'src/auth/entities/account.entity';

@Entity({ name: 'ft_task' })
export class FtTask {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => FtCategory)
  @JoinColumn({ name: 'ft_category_id' })
  ft_category_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account' })
  uid: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'is_done' })
  is_done: boolean;

  @Column({ name: 'start_at' })
  start_at: Date;

  @Column({ name: 'finish_at' })
  finish_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
