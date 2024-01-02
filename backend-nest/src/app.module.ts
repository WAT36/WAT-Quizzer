import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';
import { CategoryModule } from './category/category.module';
import { EnglishModule } from './english/english.module';
import { SayingModule } from './saying/saying.module';
import { ScrapeModule } from './scrape/scrape.module';

@Module({
  imports: [
    QuizModule,
    CategoryModule,
    EnglishModule,
    SayingModule,
    ScrapeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
