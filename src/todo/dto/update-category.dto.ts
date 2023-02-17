// import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCategoryDto {
  @ApiProperty({ example: '변경될 이름' })
  newName: string;

  @ApiProperty({ example: '#56aa7a' })
  newColor: string;
}
