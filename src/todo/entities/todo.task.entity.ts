import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Category } from './todo.category.entity';
import { Account } from './todo.account.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Category)
  category_id: Category;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  content: string;

  @Column()
  is_done: boolean;

  @Column()
  start_at: Date;

  @Column()
  finish_at: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
