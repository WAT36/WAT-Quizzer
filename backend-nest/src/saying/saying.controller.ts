import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { SayingService } from './saying.service';
import {
  AddSayingDto,
  EditSayingDto,
} from '../../interfaces/api/request/saying';
import {
  AddBookAPIRequestDto,
} from 'quizzer-lib';

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
  async addBook(@Body() req: AddBookAPIRequestDto) {
    return await this.sayingService.addBookService(req);
  }

  // 啓発本リスト取得
  @Get('/book')
  async getBookList() {
    return await this.sayingService.getBookListService();
  }

  // 格言追加
  @Post()
  async addSaying(@Body() req: AddSayingDto) {
    return await this.sayingService.addSayingService(req);
  }

  // 格言検索
  @Get('/search')
  async searchSaying(@Query('saying') saying: string) {
    return await this.sayingService.searchSayingService(saying);
  }

  // 格言編集
  @Patch()
  async editSaying(@Body() req: EditSayingDto) {
    return await this.sayingService.editSayingService(req);
  }

  // 格言取得(格言ID指定)
  @Get('/:id')
  async getSayingById(@Param('id') id: number) {
    return await this.sayingService.getSayingByIdService(id);
  }
}
