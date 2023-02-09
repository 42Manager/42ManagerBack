import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  Column,
  Unique,
} from 'typeorm';
import { Account } from './todo.account.entity';

@Entity({ name: 'category' })
@Unique(['uid', 'name'])
export class Category {
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid' })
  uid: string;

  @Column({ name: 'name' })
  name: string;

  @Column({ name: 'is_share' })
  is_share: boolean;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
