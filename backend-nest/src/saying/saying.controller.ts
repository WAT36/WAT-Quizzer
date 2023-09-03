import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SayingService } from './saying.service';
import { AddBookDto } from './saying.dto';

@Controller('saying')
export class SayingController {
  constructor(private readonly sayingService: SayingService) {}

  // 格言取得（本ID指定、無い場合はランダムで取得）
  @Get()
  async getSaying(@Query('book_id') book_id: number) {
    return await this.sayingService.getRandomSaying(book_id);
  }

  // 啓発本追加
  @Post('/book')
  async addBook(@Body() req: AddBookDto) {
    return await this.sayingService.addBookService(req);
  }

  // 啓発本リスト取得
  @Get('/book')
  async getBookList() {
    return await this.sayingService.getBookListService();
  }
}
