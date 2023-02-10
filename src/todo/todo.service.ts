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
import { ResponseTaskDto } from './dto/response-task.dto';

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
        data[i].color = value.color;
        data[i].is_share = value.is_share;
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
      createdAt: '',
    };

    try {
      const insertDataSet = {
        uid,
        name: createCategoryDto.name,
      };

      if (createCategoryDto.color) {
        insertDataSet['color'] = createCategoryDto.color;
      }

      const createResult = await this.categoryRepository.save(insertDataSet);

      data.id = createResult.id;
      data.createdAt = format(createResult.created_at, 'yyyy-MM-dd HH:mm:ss');
    } catch (err) {
      if (err.detail?.indexOf('already exists') !== -1) {
        console.log('이미 존재하는 카테고리명으로 요청하여 category 생성 실패');
        throw new BadRequestException(err.detail);
      }

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
      console.log('category 수정 실패');
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

  async getTask(uid: string) {
    const data: ResponseTaskDto[] = [];

    try {
      const getResult = await this.taskRepository.find({
        where: { uid },
        order: { start_at: 'desc', id: 'asc' },
      });

      getResult.forEach((value, i) => {
        data.push(new ResponseTaskDto());
        data[i].id = value.id;
        data[i].categoryId = value.categoryId;
        data[i].content = value.content;
        data[i].isDone = value.is_done;
        data[i].startAt = format(value.start_at, 'yyyy-MM-dd HH:mm:ss');
        if (value.is_done === true) {
          data[i].finishAt = format(value.finish_at, 'yyyy-MM-dd HH:mm:ss');
        }
        data[i].createdAt = format(value.created_at, 'yyyy-MM-dd HH:mm:ss');
      });
    } catch (err) {
      console.log('task 검색 실패');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      data,
    };
  }

  getMonthlyTask(uid: string, month: number) {}

  async createTask(uid: string, createTaskDto: CreateTaskDto) {
    const data = {
      id: 0,
      created_at: '',
    };

    try {
      const createResult = await this.taskRepository.save({
        uid,
        category_id: createTaskDto.categoryId,
        content: createTaskDto.content,
        start_at: createTaskDto.startAt,
      });

      data.id = createResult.id;
      data.created_at = format(createResult.created_at, 'yyyy-MM-dd HH:mm:ss');
    } catch (err) {
      console.log('task 생성 실패');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      data,
    };
  }

  async updateTask(taskId: number, updateTaskDto: UpdateTaskDto) {
    try {
      const updateResult = await this.taskRepository.update(
        {
          id: taskId,
        },
        {
          content: updateTaskDto.newContent,
        },
      );

      if (updateResult.affected === 0) {
        console.log('task 수정 실패');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      newContent: updateTaskDto.newContent,
    };
  }

  async deleteTask(taskId: number) {
    try {
      const deleteResult = await this.taskRepository.delete({ id: taskId });

      if (deleteResult.affected === 0) {
        console.log('존재하지 않는 카테고리 삭제 시도');
        throw new BadRequestException('not exist category');
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
    };
  }

  getFtTask(uid: string) {}
  createFtTask(uid: string, categoryId: number, createTaskDto: CreateTaskDto) {}
  updateFtTask(uid: string, categoryId: number, updateTaskDto: UpdateTaskDto) {}
  deleteFtTask(uid: string, categoryId: number) {}
}
