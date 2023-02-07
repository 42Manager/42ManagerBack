import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  uuid: string;

  @Column()
  intra: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  modified_date: Date;
}
