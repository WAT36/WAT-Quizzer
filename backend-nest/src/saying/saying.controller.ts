import { Controller, Get, Query } from '@nestjs/common';
import { SayingService } from './saying.service';

@Controller('saying')
export class SayingController {
  constructor(private readonly sayingService: SayingService) {}

  // 格言取得（本ID指定、無い場合はランダムで取得）
  @Get()
  async getSaying(@Query('book_id') book_id: number) {
    return await this.sayingService.getRandomSaying(book_id);
  }
}
