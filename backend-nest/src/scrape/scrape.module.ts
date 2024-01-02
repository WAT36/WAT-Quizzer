import { Module } from '@nestjs/common';
import { ScrapeService } from './scrape.service';
import { ScrapeController } from './scrape.controller';

@Module({
  imports: [],
  controllers: [ScrapeController],
  providers: [ScrapeService],
})
export class ScrapeModule {}
