import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// 全APIの例外をまとめて扱うフィルタ
// HttpExceptionはそのまま返し、それ以外のError(DBエラーなど)はメッセージ付きの500にする
// （各サービスでtry/catchしてHttpExceptionに包み直す必要をなくすため）
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      return super.catch(exception, host);
    }
    this.logger.error(
      exception instanceof Error
        ? (exception.stack ?? exception.message)
        : exception,
    );
    super.catch(
      new HttpException(
        exception instanceof Error
          ? exception.message
          : 'Internal server error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
      host,
    );
  }
}
