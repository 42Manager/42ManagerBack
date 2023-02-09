import { ApiProperty } from '@nestjs/swagger';

export class UpdateTaskDto {
  @ApiProperty({ example: '변경될 할 일 내용' })
  newContent: string;
}
