import {
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Entity,
} from 'typeorm';
import { Category } from './todo.category.entity';
import { User } from './todo.user.entity';

@Entity()
export class TodoList {
  @PrimaryGeneratedColumn()
  index: number;

  @ManyToOne(() => Category)
  subject: Category;

  @ManyToOne(() => User)
  user: User;

  @Column()
  todo: string;

  @Column()
  isDone: boolean;

  @Column()
  startDate: Date;

  @Column()
  finishDate: Date;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  modified_date: Date;
}
