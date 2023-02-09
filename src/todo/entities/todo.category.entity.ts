import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { CategoryKind } from './todo.category_kinds.entity';
import { Account } from './todo.account.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => CategoryKind)
  category_kind_id: CategoryKind;

  @ManyToOne(() => Account)
  user: Account;

  @Column()
  name: string;

  @Column()
  is_share: boolean;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
