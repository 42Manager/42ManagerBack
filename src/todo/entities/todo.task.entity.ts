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
import { Account } from 'src/auth/entities/account.entity';

@Entity({ name: 'task' })
export class Task {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid' })
  uid: string;

  @Column({ name: 'content' })
  content: string;

  @Column({ name: 'is_done', default: false })
  isDone: boolean;

  @Column({ name: 'start_at' })
  startAt: Date;

  @Column({ name: 'finish_at', nullable: true })
  finishAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
