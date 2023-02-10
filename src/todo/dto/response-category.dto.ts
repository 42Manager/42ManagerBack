import { ApiProperty } from '@nestjs/swagger';

export class ResponesCategoryDto {
  @ApiProperty({ description: '카테고리 id' })
  id: number;

  @ApiProperty({ description: '카테고리 이름' })
  name: string;

  @ApiProperty({ description: '카테고리 탭 색' })
  color: string;

  @ApiProperty({ description: '공유 여부' })
  isShare: boolean;

  @ApiProperty({ description: '카테고리 생성일' })
  createdAt: string;
}
