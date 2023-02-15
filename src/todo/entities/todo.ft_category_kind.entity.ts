import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'ft_category_kind' })
export class FtCategoryKind {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'tier', type: 'int' })
  tier: number;

  @Column({ name: 'is_inner', type: 'boolean' })
  isInner: boolean;

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
