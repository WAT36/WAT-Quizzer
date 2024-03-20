import { Module } from '@nestjs/common';
import { QuizFileController } from './file.controller';
import { QuizFileService } from './file.service';

@Module({
  imports: [],
  controllers: [QuizFileController],
  providers: [QuizFileService],
})
export class QuizFileModule {}
