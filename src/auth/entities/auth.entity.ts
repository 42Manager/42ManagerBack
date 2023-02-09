import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, Unique, CreateDateColumn } from 'typeorm';

@Entity()
@Unique(['intra_id'])
@ApiExtraModels()
export class Account {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    description: 'automatically generated user id',
    example: '85706800-ff89-4ea2-a354-5bdf23c1fe3e',
    required: false,
  })
  uid: string;

  @Column()
  @ApiProperty({
    description: '42intra id',
    example: 'seonghle',
    required: false,
  })
  intra_id: string;

  @Column()
  @ApiProperty({
    description: 'generated refresh token',
    example:
      'eyJhbGciOiJIUzI1NiJ9.eyJ1aWQiOiI4NTcwNjgwMC1mZjg5LTRlYTItYTM1NC01YmRmMjNjMWZlM2UiLCJJc3N1ZXIiOiJGVF9NQU4iLCJleHAiOjE2NzY0MDkyMjAsImlhdCI6MTY3NTgwNDQyMH0.rFuIgr2DmvSuGK7vKyjxHptSIY2Mv63mpvZaKKeieGE',
    required: false,
  })
  refresh_token: string;

  @CreateDateColumn()
  @ApiProperty({
    description: 'account creation time',
    example: '2023-02-07 23:24:35.01057',
    required: false,
  })
  created_at: Date;

  @Column()
  @ApiProperty({
    description: 'account modification time',
    example: '2023-02-07 23:45:29.068702',
    required: false,
  })
  updated_at: Date;
}
