import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ example: '카테고리 이름' })
  name: string;

  @ApiProperty({ example: '#56aa7a', required: false, default: '#56aa7a' })
  color: string;
}
