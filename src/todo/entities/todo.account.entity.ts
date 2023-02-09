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
  reflashToken: string;

  @CreateDateColumn()
  create_at: Date;

  @UpdateDateColumn()
  modified_at: Date;
}
