import { Module } from '@nestjs/common';
import { QuizController } from './quiz.controller';
import { QuizService } from './quiz.service';
import { QuizCsvService } from './csv/quizCsv.service';
import { QuizImageService } from './image/quizImage.service';
import { QuizStatisticsService } from './statistics/quizStatistics.service';
import { QuizFileModule } from './file/file.module';
import { CognitoAuthService } from 'src/auth/cognito/cognito-auth.service';

@Module({
  imports: [QuizFileModule],
  controllers: [QuizController],
  providers: [
    QuizService,
    QuizCsvService,
    QuizImageService,
    QuizStatisticsService,
    CognitoAuthService,
  ],
})
export class QuizModule {}
