import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/todo.category.entity';
import { Task } from './entities/todo.task.entity';
import { FtCategory } from './entities/todo.ft_category.entity';
import { FtTask } from './entities/todo.ft_task.entity';
import { Account } from './entities/todo.account.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(Account) private accountRepository: Repository<Account>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    @InjectRepository(FtCategory)
    private ftCategoryRepository: Repository<FtCategory>,
    @InjectRepository(FtTask)
    private ftTaskRepository: Repository<FtTask>,
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
  get42Category(uid: string) {}
  getTask(uid: string) {}
  getMonthlyTask(uid: string, month: number) {}
  createTask(uid: string, createTaskDto: CreateTaskDto) {}
  updateTask(uid: string, taskId: number, updateTaskDto: UpdateTaskDto) {}
  deleteTask(uid: string, taskId: number) {}
  getFtTask(uid: string) {}
  createFtTask(uid: string, categoryId: number, createTaskDto: CreateTaskDto) {}
  updateFtTask(uid: string, categoryId: number, updateTaskDto: UpdateTaskDto) {}
  deleteFtTask(uid: string, categoryId: number) {}
}
