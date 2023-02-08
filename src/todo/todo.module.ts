import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/todo.user.entity';
import { CategoryKind } from './entities/todo.category_kinds.entity';
import { Category } from './entities/todo.category.entity';
import { TodoList } from './entities/todo.todoList.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, CategoryKind, Category, TodoList])],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
