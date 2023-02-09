import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/todo.category.entity';
import { CategoryKind } from './entities/todo.category_kinds.entity';
import { TodoList } from './entities/todo.todoList.entity';
import { User } from './entities/todo.user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CategoryKind)
    private categoryKindRepository: Repository<CategoryKind>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(TodoList)
    private todoListRepository: Repository<TodoList>,
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
