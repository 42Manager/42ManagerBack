import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
@ApiExtraModels()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'automatically generated user id',
    required: false,
  })
  uid: string;

  @Column({ name: 'intra_id', unique: true, nullable: true, type: 'varchar' })
  @ApiProperty({
    description: '42intra id',
    required: false,
  })
  intraId: string;

  @Column({ name: 'refresh_token', nullable: true, type: 'text' })
  @ApiProperty({
    description: 'generated refresh token',
    required: false,
  })
  refreshToken: string;

  @Column({ name: 'image_url', nullable: true, type: 'text' })
  @ApiProperty({
    description: 'image url',
    required: false,
  })
  imageUrl: string;

  @CreateDateColumn({
    name: 'created_at',
    default: () => 'now()',
    type: 'timestamp without time zone',
  })
  @ApiProperty({
    description: 'account creation time',
    required: false,
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    nullable: true,
    type: 'timestamp without time zone',
  })
  @ApiProperty({
    description: 'account modification time',
    required: false,
  })
  updatedAt: Date;
}
