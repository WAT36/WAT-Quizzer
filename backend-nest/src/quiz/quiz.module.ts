import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizFileModule } from './file/file.module';

@Module({
  imports: [QuizFileModule],
  controllers: [QuizController],
  providers: [QuizService],
})
export class QuizModule {}
