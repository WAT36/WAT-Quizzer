import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import {
  AddTodoAPIRequestDto,
  addTodoAPIRequestSchema,
  AddTodoDiaryAPIRequestDto,
  addTodoDiaryAPIRequestSchema,
  SaveTodoCheckStatusAPIRequestDto,
  saveTodoCheckStatusAPIRequestSchema,
} from 'quizzer-lib';
import { ZodValidationPipe } from '../common/zodValidation.pipe';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags, ApiParam } from '@nestjs/swagger';

@ApiTags('Todo（Todo関連API）')
@UseGuards(CognitoAuthGuard)
@Controller('todo')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Post()
  @ApiOperation({ summary: 'Todoを新規追加します。' })
  async addTodo(
    @Body(new ZodValidationPipe(addTodoAPIRequestSchema))
    req: AddTodoAPIRequestDto,
  ) {
    return await this.todoService.addTodoService(req.todo);
  }

  @Delete('/:id')
  @ApiOperation({ summary: 'Todoを削除します（deleted_atを設定）。' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  async deleteTodo(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.deleteTodoService(id);
  }

  @Get('/all')
  @ApiOperation({
    summary: '全Todoを取得します（論理削除済みを含む）。',
  })
  async getAllTodosIncludingDeleted() {
    return await this.todoService.getAllTodosIncludingDeletedService();
  }

  @Get()
  @ApiOperation({
    summary: '有効なTodo全てを取得します（deleted_atがnullのもの）。',
  })
  async getAllTodos() {
    return await this.todoService.getAllTodosService();
  }

  @Put('/:id/restore')
  @ApiOperation({ summary: 'Todoを復元します（deleted_atをnullに戻す）。' })
  @ApiParam({ name: 'id', type: Number, description: 'Todo ID' })
  async restoreTodo(@Param('id', ParseIntPipe) id: number) {
    return await this.todoService.restoreTodoService(id);
  }

  @Post('/diary')
  @ApiOperation({
    summary: 'Todo日記を追加します（日付とcompleted=trueを登録）。',
  })
  async addTodoDiary(
    @Body(new ZodValidationPipe(addTodoDiaryAPIRequestSchema))
    req: AddTodoDiaryAPIRequestDto,
  ) {
    return await this.todoService.addTodoDiaryService(req.date);
  }

  @Get('/check-status/:date')
  @ApiOperation({
    summary: '指定日のTodoチェック状態を取得します。',
  })
  @ApiParam({ name: 'date', type: String, description: '日付 (YYYY-MM-DD)' })
  async getTodoCheckStatus(@Request() req: any, @Param('date') date: string) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return await this.todoService.getTodoCheckStatusService(userId, date);
  }

  @Put('/check-status')
  @ApiOperation({
    summary: '指定日のTodoチェック状態を保存します。',
  })
  async saveTodoCheckStatus(
    @Request() req: any,
    @Body(new ZodValidationPipe(saveTodoCheckStatusAPIRequestSchema))
    body: SaveTodoCheckStatusAPIRequestDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new Error('User ID not found');
    }
    return await this.todoService.saveTodoCheckStatusService(
      userId,
      body.date,
      body.completedTodoIds,
    );
  }
}
