import { ApiProperty } from '@nestjs/swagger';

export class ResponseTaskDto {
  @ApiProperty({ description: '아이디' })
  id: number;

  @ApiProperty({ description: '카테고리 아이디' })
  categoryId: number;

  @ApiProperty({ description: '내용' })
  content: string;

  @ApiProperty({ description: '성공 여부' })
  isDone: boolean;

  @ApiProperty({ description: '시작일시' })
  startedAt: string;

  @ApiProperty({ description: '완료일시' })
  finishedAt: string | boolean;

  @ApiProperty({ description: '생성일시' })
  createdAt: string;
}
