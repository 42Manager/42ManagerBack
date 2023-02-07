import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'categoryKind' })
export class CategoryKind {
  @PrimaryColumn()
  subject_kind: string;

  @CreateDateColumn()
  create_date: Date;

  @UpdateDateColumn()
  modified_date: Date;
}
