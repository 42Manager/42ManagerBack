import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 1 })
  categoryId: number;

  @ApiProperty({ example: '할 일 내용' })
  content: string;

  @ApiProperty({ example: '2023-02-10' })
  startAt: string;
}
