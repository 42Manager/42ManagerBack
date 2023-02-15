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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category: Category;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
  uid: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'is_done', default: false, type: 'boolean' })
  isDone: boolean;

  @Column({ name: 'started_at', type: 'timestamp without time zone' })
  startAt: Date;

  @Column({
    name: 'finished_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  finishAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'now()',
    type: 'timestamp without time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  updatedAt: Date;
}
