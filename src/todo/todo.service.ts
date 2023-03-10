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
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { format } from 'date-fns-tz';
import { ResponesCategoryDto } from './dto/response-category.dto';
import { ResponseTaskDto } from './dto/response-task.dto';
import { HttpService } from '@nestjs/axios';
import { FtCategoryKind } from './entities/todo.ft_category_kind.entity';
import { CreateFtCategoryDto } from './dto/create-ft-category.dto';

@Injectable()
export class TodoService {
  constructor(
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
      task: [],
      ftCategory: [],
      ftTask: [],
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

      const getFtCategoryResult = await this.ftCategoryRepository
        .createQueryBuilder('42category')
        .innerJoin('42category.categoryKind', 'categoryKind')
        .select(['42category.isShare', '42category.id', 'categoryKind.name'])
        .where({ uid })
        .orderBy('42category.createdAt', 'ASC')
        .getMany();

      const getFtTaskResult = await this.ftTaskRepository.find({
        where: { uid },
        order: { startedAt: 'desc', createdAt: 'asc' },
      });

      getCategoryResult.forEach((value) => {
        data['category'].push(value);
      });

      getTaskResult.forEach((value) => {
        const copiedObj = Object.assign(value);
        copiedObj.startedAt = format(new Date(value.startedAt), 'yyyy-MM-dd HH:mm:ss');

        if (value.finishedAt !== null) {
          copiedObj.finishedAt = format(new Date(value.finishedAt), 'yyyy-MM-dd HH:mm:ss');
        }
        
        data['task'].push(copiedObj);
      });

      getFtCategoryResult.forEach((value) => {
        data['ftCategory'].push(value);
      });

      getFtTaskResult.forEach((value) => {
        const copiedObj = Object.assign(value);
        copiedObj.startedAt = format(new Date(value.startedAt), 'yyyy-MM-d HH:mm:ss');

        if (value.finishedAt !== null) {
          copiedObj.finishedAt = format(new Date(value.finishedAt), 'yyyy-MM-dd HH:mm:ss');
        }

        data['ftTask'].push(copiedObj);
      });
    } catch (err) {
      console.log(err);
      console.log('?????? Todo ?????? ?????? ??????');
      throw new InternalServerErrorException(err);
    }

    return {
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
      console.log('category ?????? ??????');
      throw new InternalServerErrorException(err);
    }

    return {
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
        console.log('?????? ???????????? ????????????????????? ???????????? category ?????? ??????');
        throw new BadRequestException(err.detail);
      }

      console.log('category ?????? ??????');
      throw new InternalServerErrorException(err);
    }

    return {
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
          color: updateCategoryDto.newColor,
        },
      );

      if (updateResult.affected === 0) {
        console.log('????????? ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      console.log('category ?????? ??????');
      throw new InternalServerErrorException(err);
    }

    return {
      data: {
        name: updateCategoryDto.newName,
        color: updateCategoryDto.newColor,
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
        console.log('????????? ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: { isShare },
    };
  }

  async deleteCategory(categoryId: number) {
    try {
      const deleteResult = await this.categoryRepository.delete({
        id: categoryId,
      });

      if (deleteResult.affected === 0) {
        console.log('???????????? ?????? ???????????? ?????? ??????');
        throw new BadRequestException('not exist category');
      }
    } catch (err) {
      console.log('category ?????? ?????? ?????? ?????? ?????????');
      throw new InternalServerErrorException(err);
    }

    return {
      data: {},
    };
  }

  async get42Category(uid: string) {
    let ftCategory: FtCategory[];

    try {
      ftCategory = await this.ftCategoryRepository
        .createQueryBuilder('42category')
        .innerJoin('42category.categoryKind', 'categoryKind')
        .select(['42category.isShare', '42category.id', 'categoryKind.name'])
        .where({ uid })
        .getMany();
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }

    return {
      data: ftCategory,
    };
  }

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
      console.log('42 ????????? ?????? ?????? ??????');
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
      data: intraInfo,
    };
  }

  async create42Category(
    uid: string,
    createFtCategoryDto: CreateFtCategoryDto,
  ) {
    const data = {
      id: 0,
      createdAt: '',
    };

    try {
      const createResult = await this.ftCategoryRepository.save({
        uid,
        categoryKind: { id: createFtCategoryDto.categoryKindId },
      });

      data.id = createResult.id;
      data.createdAt = format(createResult.createdAt, 'yyyy-MM-dd HH:mm:ss');
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data,
    };
  }

  async update42CategoryIsShare(ftCategoryId: number, isShare: boolean) {
    try {
      const updateResult = await this.ftCategoryRepository.update(
        {
          id: ftCategoryId,
        },
        {
          isShare,
        },
      );

      if (updateResult.affected === 0) {
        console.log('????????? ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: { isShare },
    };
  }

  async delete42Category(ftCategoryId: number) {
    try {
      const deleteResult = await this.ftCategoryRepository.delete({
        id: ftCategoryId,
      });

      if (deleteResult.affected === 0) {
        console.log('???????????? ?????? 42 ???????????? ?????? ??????');
        throw new BadRequestException('not exist 42 category');
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: {},
    };
  }

  async getTask(uid: string) {
    const data = {};

    try {
      const getResult = await this.taskRepository.find({
        where: { uid },
        order: { categoryId: 'asc', startedAt: 'desc', id: 'asc' },
      });

      getResult.forEach((value) => {
        if (data[value.categoryId] === undefined) {
          data[value.categoryId] = [];
        }
        data[value.categoryId].push(new ResponseTaskDto());
        const item = data[value.categoryId][data[value.categoryId].length - 1];
        item.id = value.id;
        item.content = value.content;
        item.isDone = value.isDone;
        item.startedAt = format(value.startedAt, 'yyyy-MM-dd HH:mm:ss');
        item.finishedAt =
          value.isDone === true
            ? format(value.finishedAt, 'yyyy-MM-dd HH:mm:ss')
            : null;
        item.createdAt = format(value.createdAt, 'yyyy-MM-dd HH:mm:ss');
      });
    } catch (err) {
      console.log('task ?????? ??????');
      throw new InternalServerErrorException(err);
    }

    return {
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
      console.log('task ?????? ??????');
      throw new InternalServerErrorException(err);
    }

    return {
      data,
    };
  }

  async updateTaskContent(taskId: number, newContent: string) {
    try {
      const updateResult = await this.taskRepository.update(
        {
          id: taskId,
        },
        {
          content: newContent,
        },
      );

      if (updateResult.affected === 0) {
        console.log('task ?????? ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: { content: newContent },
    };
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
          isDone,
          finishedAt,
        },
      );

      if (updateResult.affected === 0) {
        console.log('task ?????? ?????? ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (finishedAt) {
      finishedAt = format(finishedAt, 'yyyy-MM-dd HH:mm:ss');
    }

    return {
      data: {
        isDone,
        finishedAt,
      },
    };
  }

  async deleteTask(taskId: number) {
    try {
      const deleteResult = await this.taskRepository.delete({ id: taskId });

      if (deleteResult.affected === 0) {
        console.log('???????????? ?????? ?????? ?????? ??????');
        throw new BadRequestException('not exist task');
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: {},
    };
  }

  async get42Task(uid: string) {
    const data = {};

    try {
      const getResult = await this.ftTaskRepository.find({
        where: { uid },
        order: { ftCategoryId: 'asc', startedAt: 'desc', id: 'asc' },
      });

      getResult.forEach((value) => {
        if (data[value.ftCategoryId] === undefined) {
          data[value.ftCategoryId] = [];
        }
        data[value.ftCategoryId].push(new ResponseTaskDto());
        const item =
          data[value.ftCategoryId][data[value.ftCategoryId].length - 1];
        item.id = value.id;
        item.content = value.content;
        item.isDone = value.isDone;
        item.startedAt = format(value.startedAt, 'yyyy-MM-dd HH:mm:ss');
        item.finishedAt =
          value.isDone === true
            ? format(value.finishedAt, 'yyyy-MM-dd HH:mm:ss')
            : null;
        item.createdAt = format(value.createdAt, 'yyyy-MM-dd HH:mm:ss');
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException(err);
    }

    return {
      data,
    };
  }

  async create42Task(uid: string, createTaskDto: CreateTaskDto) {
    const data = {
      id: 0,
      createdAt: '',
    };

    try {
      const createResult = await this.ftTaskRepository.save({
        uid,
        ftCategoryId: createTaskDto.categoryId,
        content: createTaskDto.content,
        startedAt: createTaskDto.startedAt,
      });

      data.id = createResult.id;
      data.createdAt = format(createResult.createdAt, 'yyyy-MM-dd HH:mm:ss');
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data,
    };
  }

  async update42TaskContent(taskId: number, newContent: string) {
    try {
      const updateResult = await this.ftTaskRepository.update(
        {
          id: taskId,
        },
        {
          content: newContent,
        },
      );

      if (updateResult.affected === 0) {
        console.log('42 task ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: { content: newContent },
    };
  }

  async update42TaskIsDone(taskId: number, isDone: boolean) {
    let finishedAt = null;

    if (isDone) {
      finishedAt = new Date();
    }

    try {
      const updateResult = await this.ftTaskRepository.update(
        {
          id: taskId,
        },
        {
          isDone,
          finishedAt,
        },
      );

      if (updateResult.affected === 0) {
        console.log('42 task ?????? ??????');
        throw new BadRequestException(
          'successful execution but nothing update',
        );
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (finishedAt) {
      finishedAt = format(finishedAt, 'yyyy-MM-dd HH:mm:ss');
    }

    return {
      data: {
        isDone,
        finishedAt,
      },
    };
  }

  async delete42Task(taskId: number) {
    try {
      const deleteResult = await this.ftTaskRepository.delete({
        id: taskId,
      });

      if (deleteResult.affected === 0) {
        console.log('???????????? ?????? ?????? ?????? ??????');
        throw new BadRequestException('not exist 42 task');
      }
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    return {
      data: {},
    };
  }
}
