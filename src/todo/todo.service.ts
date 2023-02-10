import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
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
import { format } from 'date-fns-tz';
import { ResponesCategoryDto } from './dto/response-category.dto';

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

  async getCategory(uid: string) {
    const data: ResponesCategoryDto[] = [];

    try {
      const categories = await this.categoryRepository.find({ where: { uid } });
      categories.forEach((value, i) => {
        data.push(new ResponesCategoryDto());
        data[i].id = value.id;
        data[i].name = value.name;
        data[i].created_at = format(value.created_at, 'yyyy-MM-dd HH:mm:ss');
      });
    } catch (err) {
      console.log('category 검색 실패');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      data,
    };
  }

  async createCategory(uid: string, createCategoryDto: CreateCategoryDto) {
    const data = {
      id: 0,
      created_at: new Date(),
    };

    try {
      const createResult = await this.categoryRepository.save({
        uid,
        name: createCategoryDto.name,
      });

      data.id = createResult.id;
      data.created_at = createResult.created_at;
    } catch (err) {
      console.log('category 생성 실패');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      data,
    };
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    try {
      const updateResult = await this.categoryRepository.update(
        {
          id: categoryId,
        },
        {
          name: updateCategoryDto.newName,
        },
      );

      if (updateResult.affected === 0) {
        console.log('변경된 것이 없음');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      console.log('category update 실패');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      data: {
        name: updateCategoryDto.newName,
      },
    };
  }

  async deleteCategory(categoryId: number) {
    try {
      const deleteResult = await this.categoryRepository.delete({
        id: categoryId,
      });

      if (deleteResult.affected === 0) {
        console.log('존재하지 않는 카테고리 삭제 시도');
        throw new BadRequestException('not exist category');
      }
    } catch (err) {
      console.log('category 삭제 실패 또는 이미 지워짐');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
    };
  }

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
