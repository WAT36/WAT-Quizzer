import { Controller, Get } from '@nestjs/common';
import { ScrapeService } from './scrape.service';

@Controller('scrape')
export class ScrapeController {
  constructor(private readonly scrapeService: ScrapeService) {}

  // 格言取得（本ID指定、無い場合はランダムで取得）
  @Get('/connpass/best')
  async getBestEvent() {
    return await this.scrapeService.getBestEvent();
  }
}
