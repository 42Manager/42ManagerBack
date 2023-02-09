import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';
import { CategoryKind } from './todo.category_kind.entity';
import { Account } from './todo.account.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => CategoryKind)
  @JoinColumn({ name: 'category_kind_id' })
  category_kind_id: CategoryKind;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'account' })
  account: Account;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'is_share' })
  is_share: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
