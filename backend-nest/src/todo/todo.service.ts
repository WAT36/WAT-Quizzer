import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { prisma } from 'quizzer-lib';
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class TodoService {
  private readonly dynamoDBClient: DynamoDBClient;
  private readonly tableName: string;

  constructor() {
    this.dynamoDBClient = new DynamoDBClient({
      region: process.env.REGION || 'ap-northeast-1',
    });
    // 環境変数からテーブル名を取得（例: dev-todo-check-status）
    const env = process.env.ENV || 'dev';
    this.tableName = `${env}-todo-check-status`;
  }
  // Todoを新規追加
  async addTodoService(todo: string) {
    return await prisma.todo.create({
      data: {
        todo,
      },
    });
  }

  // Todoを削除（deleted_atを設定）
  async deleteTodoService(id: number) {
    return await prisma.todo.update({
      data: {
        deleted_at: new Date(),
      },
      where: {
        id,
      },
    });
  }

  // 全Todo取得（deleted_at含む）
  async getAllTodosIncludingDeletedService() {
    return await prisma.todo.findMany({
      select: {
        id: true,
        todo: true,
        deleted_at: true,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Todo復元（deleted_atをnullに戻す）
  async restoreTodoService(id: number) {
    return await prisma.todo.update({
      data: {
        deleted_at: null,
      },
      where: {
        id,
      },
    });
  }

  // 有効なTodo全てを取得（deleted_atがnullのもの）
  async getAllTodosService() {
    return await prisma.todo.findMany({
      select: {
        id: true,
        todo: true,
      },
      where: {
        deleted_at: null,
      },
      orderBy: {
        id: 'asc',
      },
    });
  }

  // Todo日記を追加（日付とcompleted=trueを登録）
  async addTodoDiaryService(date: string) {
    // 日付形式のバリデーション（YYYY-MM-DD形式）
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new HttpException(
        '日付はYYYY-MM-DD形式で入力してください',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 有効な日付かどうかを確認
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      throw new HttpException(
        '有効な日付を入力してください',
        HttpStatus.BAD_REQUEST,
      );
    }

    // 日付文字列が実際の日付と一致するか確認（例: 2024-13-01のような無効な日付を防ぐ）
    const [year, month, day] = date.split('-').map(Number);
    const actualDate = new Date(year, month - 1, day);
    if (
      actualDate.getFullYear() !== year ||
      actualDate.getMonth() !== month - 1 ||
      actualDate.getDate() !== day
    ) {
      throw new HttpException(
        '有効な日付を入力してください',
        HttpStatus.BAD_REQUEST,
      );
    }

    return await prisma.todo_diary.create({
      data: {
        date,
        completed: true,
      },
    });
  }

  // Todoチェック状態を取得
  async getTodoCheckStatusService(userId: string, date: string) {
    // 日付形式のバリデーション
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new HttpException(
        '日付はYYYY-MM-DD形式で入力してください',
        HttpStatus.BAD_REQUEST,
      );
    }

    const command = new GetItemCommand({
      TableName: this.tableName,
      Key: marshall({
        userId,
        date,
      }),
    });

    const result = await this.dynamoDBClient.send(command);

    if (!result.Item) {
      // データが存在しない場合は空配列を返す
      return { completedTodoIds: [] };
    }

    const item = unmarshall(result.Item);
    return {
      completedTodoIds: item.completedTodoIds || [],
    };
  }

  // Todoチェック状態を保存
  async saveTodoCheckStatusService(
    userId: string,
    date: string,
    completedTodoIds: number[],
  ) {
    // 日付形式のバリデーション
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new HttpException(
        '日付はYYYY-MM-DD形式で入力してください',
        HttpStatus.BAD_REQUEST,
      );
    }

    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: marshall({
        userId,
        date,
        completedTodoIds,
      }),
    });

    await this.dynamoDBClient.send(command);

    return {
      userId,
      date,
      completedTodoIds,
    };
  }
}
