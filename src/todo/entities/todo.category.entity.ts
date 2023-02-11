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

  @Column({ name: 'is_share', default: true })
  isShare: boolean;

  @Column({ name: 'color', default: '#56aa7a' })
  color: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  updatedAt: Date;
}
