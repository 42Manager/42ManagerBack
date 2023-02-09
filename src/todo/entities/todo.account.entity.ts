import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid')
  uid: string;

  @Column()
  intra: string;

  @Column()
  reflash_token: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
