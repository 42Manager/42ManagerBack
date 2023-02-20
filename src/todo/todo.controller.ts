import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { JwtPayload } from 'src/decorator/jwt-payload.decorator';
import { Account } from 'src/auth/entities/account.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { CreateFtCategoryDto } from './dto/create-ft-category.dto';

@ApiTags('Todo')
@ApiBearerAuth()
@Controller('todo')
@UseGuards(JwtAccessTokenGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({
    summary: 'Todo 목록 검색',
    description: '요청한 사용자의 모든 카테고리와 작업 반환',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            category: {
              type: 'array',
              items: {
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  isShare: { type: 'boolean' },
                  color: { type: 'string' },
                  createdAt: { type: 'string', format: 'date-time' },
                  updatedAt: {
                    type: 'string',
                    format: 'date-time',
                    nullable: true,
                  },
                },
              },
            },
            task: {
              type: 'object',
              properties: {
                'yyyy-MM-dd': {
                  type: 'array',
                  items: {
                    properties: {
                      id: { type: 'number' },
                      categoryId: { type: 'number' },
                      content: { type: 'string' },
                      isDone: { type: 'boolean' },
                      startedAt: { type: 'string', format: 'date-time' },
                      finishedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
            ftCategory: {
              type: 'array',
              items: {
                properties: {
                  id: { type: 'number' },
                  isShare: { type: 'boolean' },
                  categoryKind: {
                    type: 'object',
                    properties: {
                      name: { type: 'string' },
                    },
                  },
                },
              },
            },
            ftTask: {
              type: 'object',
              properties: {
                'yyyy-MM-dd': {
                  type: 'array',
                  items: {
                    properties: {
                      id: { type: 'number' },
                      ftCategoryId: { type: 'number' },
                      content: { type: 'string' },
                      isDone: { type: 'boolean' },
                      startedAt: { type: 'string', format: 'date-time' },
                      finishedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                      },
                      createdAt: { type: 'string', format: 'date-time' },
                      updatedAt: {
                        type: 'string',
                        format: 'date-time',
                        nullable: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Get()
  getAllTodo(@JwtPayload() account: Account) {
    return this.todoService.getAllTodo(account.uid);
  }

  @ApiOperation({
    summary: '카테고리 검색',
    description: '요청한 사용자의 일반 카테고리 반환',
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            category: {
              type: 'array',
              items: {
                properties: {
                  id: { type: 'number' },
                  name: { type: 'string' },
                  color: { type: 'string' },
                  isShare: { type: 'boolean' },
                  createdAt: { type: 'string', format: 'date-time' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Get('category')
  getCategory(@JwtPayload() account: Account) {
    return this.todoService.getCategory(account.uid);
  }

  @ApiOperation({ summary: '카테고리 생성' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: '이미 존재하는 카테고리명' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Post('category')
  createCategory(
    @JwtPayload() account: Account,
    @Body() createTodoDto: CreateCategoryDto,
  ) {
    return this.todoService.createCategory(account.uid, createTodoDto);
  }

  @ApiOperation({ summary: '카테고리 수정' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            color: { type: 'string' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: '변경된 것이 없음' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Patch('category/:id')
  updateCategory(
    @Param('id') categoryId: number,
    @Body() updateTodoDto: UpdateCategoryDto,
  ) {
    return this.todoService.updateCategory(categoryId, updateTodoDto);
  }

  @ApiOperation({ summary: '카테고리 공유 여부 수정' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            isShare: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: '변경된 것이 없음' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Patch('category/:id/is-share')
  updateCategoryIsShare(
    @Param('id') categoryId: number,
    @Body('isShare') isShare: boolean,
  ) {
    return this.todoService.updateCategoryIsShare(categoryId, isShare);
  }

  @ApiOperation({ summary: '카테고리 삭제' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {},
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: '삭제할 것이 없음' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Delete('category/:id')
  deleteCategory(@Param('id') categoryId: number) {
    return this.todoService.deleteCategory(categoryId);
  }

  @ApiOperation({
    summary: '42 카테고리 선택 목록 검색',
    requestBody: {
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              ftAccessToken: {
                type: 'string',
              },
            },
          },
        },
      },
    },
  })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            inProgress: {
              type: 'array',
              items: {
                properties: {
                  categoryKindId: { type: 'number' },
                  name: { type: 'string' },
                },
              },
            },
            finished: {
              type: 'array',
              items: {
                properties: {
                  categoryKindId: { type: 'number' },
                  name: { type: 'string' },
                },
              },
            },
            forbidden: {
              type: 'array',
              items: {
                properties: {
                  categoryKindId: { type: 'number' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: '유효하지 않은 42 token' })
  @Get('42category-kind')
  get42CategoryKind(@Body('ftAccessToken') ftAccessToken: string) {
    return this.todoService.get42CategoryKind(ftAccessToken);
  }

  @ApiOperation({ summary: '42 카테고리 검색' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'array',
          items: {
            properties: {
              id: { type: 'number' },
              isShare: { type: 'boolean' },
              categoryKind: {
                type: 'object',
                properties: {
                  name: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Get('42category')
  get42Category(@JwtPayload() account: Account) {
    return this.todoService.get42Category(account.uid);
  }

  @ApiOperation({ summary: '42 카테고리 추가' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Post('42category')
  create42Category(
    @JwtPayload() account: Account,
    @Body() createFtCategoryDto: CreateFtCategoryDto,
  ) {
    return this.todoService.create42Category(account.uid, createFtCategoryDto);
  }

  @ApiOperation({ summary: '42 카테고리 공유 여부 수정' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            isShare: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({ description: '변경된 것이 없음' })
  @ApiInternalServerErrorResponse({ description: '서버 에러 발생' })
  @Patch('42category/:id/is-share')
  update42CategoryIsShare(
    @Param('id') ftCategoryId: number,
    @Body('isShare') isShare: boolean,
  ) {
    return this.todoService.update42CategoryIsShare(ftCategoryId, isShare);
  }

  @ApiOperation({ summary: '42 카테고리 삭제' })
  @ApiOkResponse({
    description: '성공',
    schema: {
      type: 'object',
      properties: {
        data: { type: 'object' },
      },
    },
  })
  @Delete('42category/:id')
  delete42Category(@Param('id') ftCategoryId: number) {
    return this.todoService.delete42Category(ftCategoryId);
  }

  @ApiOperation({ summary: 'task 검색' })
  @Get('task')
  getTask(@JwtPayload() account: Account) {
    return this.todoService.getTask(account.uid);
  }

  @ApiOperation({ summary: 'task 추가' })
  @Post('task')
  createTask(
    @JwtPayload() account: Account,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.todoService.createTask(account.uid, createTaskDto);
  }

  @ApiOperation({ summary: 'task 수정' })
  @Patch('task/:id/content')
  updateTaskContent(
    @Param('id') taskId: number,
    @Body('newContent') newContent: string,
  ) {
    return this.todoService.updateTaskContent(taskId, newContent);
  }

  @ApiOperation({ summary: 'task 완료 여부 수정' })
  @Patch('task/:id/is-done')
  updateTaskIsDone(
    @Param('id') taskId: number,
    @Body('isDone') isDone: boolean,
  ) {
    return this.todoService.updateTaskIsDone(taskId, isDone);
  }

  @ApiOperation({ summary: 'task 삭제' })
  @Delete('task/:id')
  deleteTask(@Param('id') taskId: number) {
    return this.todoService.deleteTask(taskId);
  }

  @ApiOperation({ summary: '42 task 검색' })
  @Get('42task')
  get42Task(@JwtPayload() account: Account) {
    return this.todoService.get42Task(account.uid);
  }

  @ApiOperation({ summary: '42 task 생성' })
  @Post('42task')
  create42Task(
    @JwtPayload() account: Account,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.todoService.create42Task(account.uid, createTaskDto);
  }

  @ApiOperation({ summary: '42 task 수정' })
  @Patch('42task/:id/content')
  update42Task(
    @Param('id') taskId: number,
    @Body('newContent') newContent: string,
  ) {
    return this.todoService.update42TaskContent(taskId, newContent);
  }

  @ApiOperation({ summary: '42 task 완료 여부 수정' })
  @Patch('42task/:id/is-done')
  update42TaskIsDone(
    @Param('id') taskId: number,
    @Body('isDone') isDone: boolean,
  ) {
    return this.todoService.update42TaskIsDone(taskId, isDone);
  }

  @ApiOperation({ summary: '42 task 삭제' })
  @Delete('42task/:id')
  delete42Task(@Param('id') taskId: number) {
    return this.todoService.delete42Task(taskId);
  }
}
