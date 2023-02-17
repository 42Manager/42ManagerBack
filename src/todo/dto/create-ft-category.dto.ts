import { ApiProperty } from '@nestjs/swagger';

export class CreateFtCategoryDto {
  @ApiProperty({ example: '42과제 카테고리 아이디' })
  categoryKindId: number;
}
