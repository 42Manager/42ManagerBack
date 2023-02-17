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
import { Account } from 'src/auth/entities/account.entity';

@Entity({ name: 'category' })
@Unique(['uid', 'name'])
export class Category {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
  uid: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'is_share', default: true, type: 'boolean' })
  isShare: boolean;

  @Column({ name: 'color', default: '#56aa7a', type: 'varchar' })
  color: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'now()',
    type: 'timestamp without time zone',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  updatedAt: Date;
}
