import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/todo.account.entity';
import { CategoryKind } from './entities/todo.category_kind.entity';
import { Category } from './entities/todo.category.entity';
import { Task } from './entities/todo.task.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Account, CategoryKind, Category, Task])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
