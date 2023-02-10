import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
  JoinColumn,
} from 'typeorm';
import { Category } from './todo.category.entity';
import { Account } from './todo.account.entity';

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid' })
  uid: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'is_done', default: false })
  is_done: boolean;

  @Column({ name: 'start_at' })
  start_at: Date;

  @Column({ name: 'finish_at', nullable: true })
  finish_at: Date;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updated_at: Date;
}
