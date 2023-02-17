import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { FtCategoryKind } from './todo.ft_category_kind.entity';

@Entity({ name: 'ft_category' })
@Unique(['categoryKind', 'uid'])
export class FtCategory {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ManyToOne(() => FtCategoryKind)
  @JoinColumn({ name: 'category_kind_id', referencedColumnName: 'id' })
  categoryKind: FtCategoryKind;

  @ManyToOne(() => Account)
  @JoinColumn({ name: 'uid', referencedColumnName: 'uid' })
  uid: string;

  @Column({ name: 'is_share', default: true, type: 'boolean' })
  isShare: boolean;

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
