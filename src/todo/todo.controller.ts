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
import { Cookies } from 'src/decorator/cookie-jwt.decorator';

@ApiTags('Todo')
@ApiBearerAuth()
@Controller('todo')
@UseGuards(JwtAccessTokenGuard)
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

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

  @ApiOperation({ summary: '카테고리 공유 여부 수정' })
  @Patch('category/:id/is-share')
  updateCategoryIsShare(
    @Param('id') categoryId: number,
    @Body('isShare') isShare: boolean,
  ) {
    return this.todoService.updateCategoryIsShare(categoryId, isShare);
  }

  @ApiOperation({ summary: '카테고리 삭제' })
  @Delete('category/:id')
  deleteCategory(@Param('id') categoryId: number) {
    return this.todoService.deleteCategory(categoryId);
  }

  @ApiOperation({ summary: '42 카테고리 선택 목록 검색' })
  @Get('42category-kind')
  get42CategoryKind(@Cookies('ftAccessToken') ftAccessToken: string) {
    return this.todoService.get42CategoryKind(ftAccessToken);
  }

  @ApiOperation({ summary: '42 카테고리 검색' })
  @Get('42category')
  get42Category(@JwtPayload() account: Account) {
    return this.todoService.get42Category(account.uid);
  }

  @ApiOperation({ summary: '42 카테고리 추가' })
  @Post('42category')
  create42Category(
    @JwtPayload() account: Account,
    @Body() createFtCategoryDto: CreateFtCategoryDto,
  ) {
    return this.todoService.create42Category(account.uid, createFtCategoryDto);
  }

  @ApiOperation({ summary: '42 카테고리 공유 여부 수정' })
  @Patch('42category/:id/is-share')
  update42CategoryIsShare(
    @Param('id') ftCategoryId: number,
    @Body('isShare') isShare: boolean,
  ) {
    return this.todoService.update42CategoryIsShare(ftCategoryId, isShare);
  }

  @ApiOperation({ summary: '42 카테고리 삭제' })
  @Delete('42category/:id')
  delete42Category(@Param('id') ftCategoryId: number) {
    return this.todoService.delete42Category(ftCategoryId);
  }

  @ApiOperation({ summary: '전체 task 검색' })
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
