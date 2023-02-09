import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from 'src/auth/guard/jwt.auth.guard';
import { GetAccount } from 'src/auth/decorator/account-info.decorator';
import { Account } from 'src/auth/entities/auth.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Todo')
@ApiBearerAuth()
@Controller('todo')
@UseGuards(JwtAccessTokenGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @ApiOperation({ summary: '월간 일별 task 개수 검색' })
  @Get('count')
  getMonthlyTodoCount(
    @GetAccount() account: Account,
    @Query('month') month: number,
  ) {
    return this.todoService.getMonthlyTodoCount(account.uid, month);
  }

  @ApiOperation({ summary: '카테고리 검색' })
  @Get('category')
  getCategory(@GetAccount() account: Account) {
    return this.todoService.getCategory(account.uid);
  }

  @ApiOperation({ summary: '카테고리 생성' })
  @Post('category')
  createCategory(
    @GetAccount() account: Account,
    @Body() createTodoDto: CreateCategoryDto,
  ) {
    return this.todoService.createCategory(account.uid, createTodoDto);
  }

  @ApiOperation({ summary: '카테고리 수정' })
  @Patch('category/:id')
  updateCategory(
    @GetAccount() account: Account,
    @Param('id') categoryId: number,
    @Body() updateTodoDto: UpdateCategoryDto,
  ) {
    return this.todoService.updateCategory(
      account.uid,
      categoryId,
      updateTodoDto,
    );
  }

  @ApiOperation({ summary: '카테고리 삭제' })
  @Delete('category/:id')
  deleteCategory(
    @GetAccount() account: Account,
    @Param('id') categoryId: number,
  ) {
    return this.todoService.deleteCategory(account.uid, categoryId);
  }

  @ApiOperation({ summary: '전체 task 검색' })
  @Get('task')
  getTask(@GetAccount() account: Account) {
    return this.todoService.getTask(account.uid);
  }

  @ApiOperation({ summary: '월별 전체 task 검색' })
  getMonthlyTask(
    @GetAccount() account: Account,
    @Query('month') month: number,
  ) {
    return this.todoService.getMonthlyTask(account.uid, month);
  }

  @ApiOperation({ summary: 'task 추가' })
  @Post('task')
  createTask(
    @GetAccount() account: Account,
    @Body() createTaskDto: CreateTaskDto,
  ) {
    return this.todoService.createTask(account.uid, createTaskDto);
  }

  @ApiOperation({ summary: 'task 수정' })
  @Patch('task/:id')
  updateTask(
    @GetAccount() account: Account,
    @Param('id') taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.todoService.updateTask(account.uid, taskId, updateTaskDto);
  }

  @ApiOperation({ summary: 'task 삭제' })
  @Delete('task/:id')
  deleteTask(@GetAccount() account: Account, @Param('id') taskId: number) {
    return this.todoService.deleteTask(account.uid, taskId);
  }
}
