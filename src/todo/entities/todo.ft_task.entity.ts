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
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => FtCategory)
  @JoinColumn({ name: 'ft_category_id', referencedColumnName: 'id' })
  ft_category_id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
  uid: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'is_done', default: false, type: 'boolean' })
  is_done: boolean;

  @Column({ name: 'started_at', type: 'timestamp without time zone' })
  start_at: Date;

  @Column({
    name: 'finished_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  finish_at: Date;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'now()',
    type: 'timestamp without time zone',
  })
  created_at: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  updated_at: Date;
}
