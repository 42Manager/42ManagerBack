import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: '29b11049461ffb373663fd2220be77169308a7346ecd6c28597260012612af43',
  })
  code: string;
}
