import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { CategoryKind } from './todo.category_kinds.entity';
import { User } from './todo.user.entity';

@Entity({ name: 'category' })
export class Category {
  @PrimaryColumn()
  category: string;

  @ManyToOne(() => CategoryKind)
  categoryKind: CategoryKind;

  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  modified_date: Date;
}
