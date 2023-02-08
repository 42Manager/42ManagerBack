import { IsString, IsUUID } from 'class-validator';

export class CreateTestTodoDto {
  @IsUUID()
  readonly uuid: string;

  @IsString()
  readonly categoryKind: string;

  @IsString()
  readonly category: string;

  @IsString()
  readonly todo: string;
}
