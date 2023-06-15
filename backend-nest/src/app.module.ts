import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { QuizModule } from './quiz/quiz.module';

@Module({
  imports: [QuizModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
