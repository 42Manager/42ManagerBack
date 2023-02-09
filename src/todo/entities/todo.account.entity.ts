import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'account' })
export class Account {
  @PrimaryGeneratedColumn('uuid', { name: 'uid' })
  uid: string;

  @Column({ name: 'intra_id' })
  intra_id: string;

  @Column({ name: 'refresh_token' })
  refresh_token: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;
}
