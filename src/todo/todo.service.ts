import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTestTodoDto } from './dto/create-testTodo.dto';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Category } from './entities/todo.category.entity';
import { CategoryKind } from './entities/todo.category_kinds.entity';
import { TodoList } from './entities/todo.todoList.entity';
import { User } from './entities/todo.user.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(CategoryKind) private categoryKindRepository: Repository<CategoryKind>,
    @InjectRepository(Category) private categoryRepository: Repository<Category>,
    @InjectRepository(TodoList) private todoListRepository: Repository<TodoList>,
  ) {}

  create(createTodoDto: CreateTodoDto) {
    return 'This action adds a new todo';
  }

  // createTest(createTestTodoDto: CreateTestTodoDto) {
  //   const user = this.userRepository.findOne({
  //     where: { uuid: createTestTodoDto.uuid },
  //   });
  // }

  findAll() {
    return `This action returns all todo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} todo`;
  }

  update(id: number, updateTodoDto: UpdateTodoDto) {
    return `This action updates a #${id} todo`;
  }

  remove(id: number) {
    return `This action removes a #${id} todo`;
  }
}
