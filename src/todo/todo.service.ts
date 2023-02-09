import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/todo.category.entity';
import { CategoryKind } from './entities/todo.category_kind.entity';
import { Task } from './entities/todo.task.entity';
import { Account } from './entities/todo.account.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(CategoryKind)
    private categoryKindRepository: Repository<CategoryKind>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  getMonthlyTodoCount(uid: string, month: number) {}
  getCategory(uid: string) {}
  createCategory(uid: string, createCategoryDto: CreateCategoryDto) {}
  updateCategory(
    uid: string,
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {}
  deleteCategory(uid: string, categoryId: number) {}
  getTask(uid: string) {}
  getMonthlyTask(uid: string, month: number) {}
  createTask(uid: string, createTaskDto: CreateTaskDto) {}
  updateTask(uid: string, taskId: number, updateTaskDto: UpdateTaskDto) {}
  deleteTask(uid: string, taskId: number) {}
}
