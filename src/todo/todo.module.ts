import { Module } from '@nestjs/common';
import { TodoService } from './todo.service';
import { TodoController } from './todo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from 'src/auth/entities/account.entity';
import { Category } from './entities/todo.category.entity';
import { Task } from './entities/todo.task.entity';
import { FtCategory } from './entities/todo.ft_category.entity';
import { FtTask } from './entities/todo.ft_task.entity';
import { FtCategoryKind } from './entities/todo.ft_category_kind.entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Category,
      Task,
      FtCategory,
      FtTask,
      FtCategoryKind,
    ]),
    HttpModule,
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
