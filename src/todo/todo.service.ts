import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/todo.category.entity';
import { Task } from './entities/todo.task.entity';
import { FtCategory } from './entities/todo.ft_category.entity';
import { FtTask } from './entities/todo.ft_task.entity';
import { Account } from 'src/auth/entities/account.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { format } from 'date-fns-tz';
import { ResponesCategoryDto } from './dto/response-category.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { HttpService } from '@nestjs/axios';
import { FtCategoryKind } from './entities/todo.ft_category_kind.entity';

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
    @InjectRepository(FtCategoryKind)
    private ftCategoryKindRepository: Repository<FtCategoryKind>,
    private readonly httpService: HttpService,
  ) {}

  async getAllTodo(uid: string) {
    const data = {
      category: [],
      task: {},
    };

    try {
      const getCategoryResult = await this.categoryRepository.find({
        where: { uid },
        order: { createdAt: 'asc' },
      });

      const getTaskResult = await this.taskRepository.find({
        where: { uid },
        order: { startedAt: 'desc', createdAt: 'asc' },
      });

      getCategoryResult.forEach((value) => {
        data['category'].push(value);
      });
      getTaskResult.forEach((value) => {
        if (data['task'][format(value.startedAt, 'yyyy-MM-dd')] == null) {
          data['task'][format(value.startedAt, 'yyyy-MM-dd')] = [];
        }
        data['task'][format(value.startedAt, 'yyyy-MM-dd')].push(value);
      });
    } catch (err) {
      console.log('전체 Todo 목록 검색 실패');
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      data,
    };
  }

  async getCategory(uid: string) {
    const data: ResponesCategoryDto[] = [];

    try {
      const categories = await this.categoryRepository.find({ where: { uid } });
      categories.forEach((value, i) => {
        data.push(new ResponesCategoryDto());
        data[i].id = value.id;
        data[i].name = value.name;
        data[i].color = value.color;
        data[i].isShare = value.isShare;
        data[i].createdAt = format(value.createdAt, 'yyyy-MM-dd HH:mm:ss');
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
      data.createdAt = format(createResult.createdAt, 'yyyy-MM-dd HH:mm:ss');
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

  async updateCategoryIsShare(categoryId: number, isShare: boolean) {
    try {
      const updateResult = await this.categoryRepository.update(
        {
          id: categoryId,
        },
        {
          isShare,
        },
      );

      if (updateResult.affected === 0) {
        console.log('변경된 것이 없음');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      isShare,
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

  async get42CategoryKind(ftAccessToken: string) {
    const intraInfo = {};

    try {
      const subjects = await this.httpService.axiosRef.get(
        'https://api.intra.42.fr/v2/me',
        {
          headers: {
            Authorization: `Bearer ${ftAccessToken}`,
            'content-type': 'application/json',
          },
        },
      );

      const projects = subjects.data.projects_users.filter((projects) =>
        projects.cursus_ids.includes(21),
      );

      intraInfo['inProgress'] = projects
        .filter((filterdData) => filterdData.marked === false)
        .map((mappedData) => {
          return {
            categoryKindId: -1,
            name: mappedData.project.name,
          };
        });
      intraInfo['finished'] = projects
        .filter((filterdData) => filterdData.marked === true)
        .map((mappedData) => {
          return {
            categoryKindId: -1,
            name: mappedData.project.name,
          };
        });
    } catch (err) {
      console.log('42 사용자 정보 확인 실패');
      console.log(err);
      throw new UnauthorizedException(err);
    }

    const ftCategoryKind: FtCategoryKind[] =
      await this.ftCategoryKindRepository.find();

    intraInfo['inProgress'].forEach((inProgressItem) => {
      const foundCategoryKind = ftCategoryKind.find(
        (categoryKindItem) => inProgressItem.name === categoryKindItem.name,
      );
      if (foundCategoryKind !== undefined) {
        inProgressItem.categoryKindId = foundCategoryKind.id;
      }
    });

    intraInfo['finished'].forEach((finishedItem) => {
      const foundCategoryKind = ftCategoryKind.find(
        (categoryKindItem) => finishedItem.name === categoryKindItem.name,
      );
      if (foundCategoryKind !== undefined) {
        finishedItem.categoryKindId = foundCategoryKind.id;
      }
    });

    intraInfo['forbidden'] = ftCategoryKind
      .filter(
        (filterdData) =>
          intraInfo['inProgress'].findIndex(
            (item) => filterdData.name === item.name,
          ) == -1 &&
          intraInfo['finished'].findIndex(
            (item) => filterdData.name === item.name,
          ) == -1,
      )
      .map((mappedData) => {
        return { categoryKindId: mappedData.id, name: mappedData.name };
      });

    return {
      status: true,
      data: intraInfo,
    };
  }

  async getTask(uid: string) {
    const data: ResponseTaskDto[] = [];

    try {
      const getResult = await this.taskRepository.find({
        where: { uid },
        order: { startedAt: 'desc', id: 'asc' },
      });

      getResult.forEach((value, i) => {
        data.push(new ResponseTaskDto());
        data[i].id = value.id;
        data[i].categoryId = value.categoryId;
        data[i].content = value.content;
        data[i].isDone = value.isDone;
        data[i].startAt = format(value.startAt, 'yyyy-MM-dd HH:mm:ss');
        data[i].finishAt =
          value.isDone === true
            ? format(value.finishedAt, 'yyyy-MM-dd HH:mm:ss')
            : null;
        data[i].createdAt = format(value.createdAt, 'yyyy-MM-dd HH:mm:ss');
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

  async createTask(uid: string, createTaskDto: CreateTaskDto) {
    const data = {
      id: 0,
      createdAt: '',
    };

    try {
      const createResult = await this.taskRepository.save({
        uid,
        categoryId: createTaskDto.categoryId,
        content: createTaskDto.content,
        startedAt: new Date(createTaskDto.startedAt),
      });

      data.id = createResult.id;
      data.createdAt = format(createResult.createdAt, 'yyyy-MM-dd HH:mm:ss');
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
  }

  async updateTaskIsDone(taskId: number, isDone: boolean) {
    let finishedAt = null;

    if (isDone) {
      finishedAt = new Date();
    }
    try {
      const updateResult = await this.taskRepository.update(
        {
          id: taskId,
        },
        {
          isDone: isDone,
          finishedAt: finishedAt,
        },
      );

      if (updateResult.affected === 0) {
        console.log('task 완료 여부 수정 실패');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      status: true,
      isDone: isDone,
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
