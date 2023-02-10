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
    example: '85706800-ff89-4ea2-a354-5bdf23c1fe3e',
    required: false,
  })
  uid: string;

  @Column({ name: 'intra_id', unique: true, nullable: true })
  @ApiProperty({
    description: '42intra id',
    example: 'seonghle',
    required: false,
  })
  intraId: string;

  @Column({ name: 'refresh_token', nullable: true })
  @ApiProperty({
    description: 'generated refresh token',
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI4NTcwNjgwMC1mZjg5LTRlYTItYTM1NC01YmRmMjNjMWZlM2UiLCJJc3N1ZXIiOiJGVF9NQU4iLCJleHAiOjE2NzY0MDkyMjAsImlhdCI6MTY3NTgwNDQyMH0.rFuIgr2DmvSuGK7vKyjxHptSIY2Mv63mpvZaKKeieGE',
    required: false,
  })
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  @ApiProperty({
    description: 'account creation time',
    example: '2023-02-07 23:24:35.01057',
    required: false,
  })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', nullable: true })
  @ApiProperty({
    description: 'account modification time',
    example: '2023-02-07 23:45:29.068702',
    required: false,
  })
  updatedAt: Date;
}
