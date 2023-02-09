import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { CategoryKind } from './todo.category_kind.entity';
import { Account } from './todo.account.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CategoryKind)
  category_kind_id: CategoryKind;

  @ManyToOne(() => Account)
  account: Account;

  @Column()
  name: string;

  @Column()
  is_share: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
