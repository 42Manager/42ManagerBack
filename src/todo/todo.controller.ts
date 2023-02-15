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
import { JwtPayload } from 'src/decorator/jwt-payload.decorator';
import { Account } from 'src/auth/entities/account.entity';
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
    @JwtPayload() account: Account,
    @Query('month') month: number,
  ) {
    return this.todoService.getMonthlyTodoCount(account.uid, month);
  }

  @ApiOperation({ summary: '전체 Todo 목록 검색' })
  @Get()
  getAllTodo(@JwtPayload() account: Account) {
    return this.todoService.getAllTodo(account.uid);
  }

  @ApiOperation({ summary: '카테고리 검색' })
  @Get('category')
  getCategory(@JwtPayload() account: Account) {
    return this.todoService.getCategory(account.uid);
  }

  @ApiOperation({ summary: '카테고리 생성' })
  @Post('category')
  createCategory(
    @JwtPayload() account: Account,
    @Body() createTodoDto: CreateCategoryDto,
  ) {
    return this.todoService.createCategory(account.uid, createTodoDto);
  }

  @ApiOperation({ summary: '카테고리 수정' })
  @Patch('category/:id')
  updateCategory(
    @Param('id') categoryId: number,
    @Body() updateTodoDto: UpdateCategoryDto,
  ) {
    return this.todoService.updateCategory(categoryId, updateTodoDto);
  }

  @ApiOperation({ summary: '카테고리 삭제' })
  @Delete('category/:id')
  deleteCategory(@Param('id') categoryId: number) {
    return this.todoService.deleteCategory(categoryId);
  }

  @ApiOperation({ summary: '42 카테고리 검색' })
  @Get('42category')
  get42Category(@JwtPayload() account: Account) {
    // cookie에 있는 인트라 토큰 받도록 구현 필요
    // 42 inner 과제 목록과 현재 42서울 사용자가 등록한 과제 목록 가져오기
    // 끝낸 과제와 등록하지 않은 과제는 후순위로 될 수 있도록 내림
    // 1. 등록한 과제 2. 등록 가능한 과제 3. 끝낸 과제 4. 등록할 수 없는 과제
  }

  @ApiOperation({ summary: '42 카테고리 삭제' })
  @Delete('42category/:id')
  delete42Category() {}

  @ApiOperation({ summary: '전체 task 검색' })
  @Get('task')
  getTask(@JwtPayload() account: Account) {
    return this.todoService.getTask(account.uid);
  }

  @ApiOperation({ summary: '월별 전체 task 검색' })
  getMonthlyTask(
    @JwtPayload() account: Account,
    @Query('month') month: number,
  ) {
    return this.todoService.getMonthlyTask(account.uid, month);
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
  @Patch('task/:id')
  updateTask(
    @Param('id') taskId: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ) {
    return this.todoService.updateTask(taskId, updateTaskDto);
  }

  @ApiOperation({ summary: 'task 삭제' })
  @Delete('task/:id')
  deleteTask(@Param('id') taskId: number) {
    return this.todoService.deleteTask(taskId);
  }

  @ApiOperation({ summary: '42 task 검색' })
  @Get('42task')
  getFtTask(@JwtPayload() account: Account) {}

  @ApiOperation({ summary: '42 task 생성' })
  @Post('42task')
  createFtTask(@JwtPayload() account: Account) {}

  @ApiOperation({ summary: '42 task 수정' })
  @Patch('42task/:id')
  updateFtTask(@JwtPayload() account: Account) {}

  @ApiOperation({ summary: '42 task 삭제' })
  @Delete('42task/:id')
  deleteFtTask(@JwtPayload() account: Account) {}
}
