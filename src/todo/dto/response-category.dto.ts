import { ApiProperty } from '@nestjs/swagger';

export class ResponesCategoryDto {
  @ApiProperty({ description: '' })
  id: number;

  @ApiProperty({ description: '' })
  name: string;

  @ApiProperty({ description: '' })
  created_at: string;
}
