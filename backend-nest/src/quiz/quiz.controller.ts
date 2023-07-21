import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { RemoveCategoryOfQuizDto } from './dto/quiz.category.dto';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('/file')
  async getFileList() {
    return await this.quizService.getFileList();
  }

  @Get()
  async getQuiz(
    @Query('file_num') file_num: number,
    @Query('quiz_num') quiz_num: number,
  ) {
    return await this.quizService.getQuiz(file_num, quiz_num);
  }

  @Get('/random')
  async getRandomQuiz(
    @Query('file_num') file_num: number,
    @Query('min_rate') min_rate: number,
    @Query('max_rate') max_rate: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
  ) {
    return await this.quizService.getRandomQuiz(
      file_num,
      min_rate,
      max_rate,
      category,
      checked,
    );
  }

  @Get('/worst')
  async getWorstRateQuiz(
    @Query('file_num') file_num: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
  ) {
    return await this.quizService.getWorstRateQuiz(file_num, category, checked);
  }

  @Get('/minimum')
  async getMinimumAnsweredQuiz(
    @Query('file_num') file_num: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
  ) {
    return await this.quizService.getMinimumAnsweredQuiz(
      file_num,
      category,
      checked,
    );
  }

  @Post('/clear')
  async cleared(file_num: number, quiz_num: number) {
    return await this.quizService.cleared(file_num, quiz_num);
  }

  @Post('/fail')
  async failed(file_num: number, quiz_num: number) {
    return await this.quizService.failed(file_num, quiz_num);
  }

  @Post('/add')
  async add(file_num: number, input_data: string) {
    return await this.quizService.add(file_num, input_data);
  }

  @Post('/edit')
  async edit(
    file_num: number,
    quiz_num: number,
    question: string,
    answer: string,
    category: string,
    img_file: string,
  ) {
    return await this.quizService.edit(
      file_num,
      quiz_num,
      question,
      answer,
      category,
      img_file,
    );
  }

  @Get('/search')
  async search(
    @Query('file_num') file_num: number,
    @Query('min_rate') min_rate: number,
    @Query('max_rate') max_rate: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
    @Query('query') query: string,
    @Query('searchInOnlySentense') searchInOnlySentense: string,
    @Query('searchInOnlyAnswer') searchInOnlyAnswer: string,
  ) {
    return await this.quizService.search(
      file_num,
      min_rate,
      max_rate,
      category,
      checked,
      query,
      searchInOnlySentense,
      searchInOnlyAnswer,
    );
  }

  @Delete()
  async delete(file_num: number, quiz_num: number) {
    return await this.quizService.delete(file_num, quiz_num);
  }

  @Post('/integrate')
  async integrate(
    pre_file_num: number,
    pre_quiz_num: number,
    post_file_num: number,
    post_quiz_num: number,
  ) {
    return await this.quizService.integrate(
      pre_file_num,
      pre_quiz_num,
      post_file_num,
      post_quiz_num,
    );
  }

  @Post('/category')
  async addCategoryToQuiz(
    file_num: number,
    quiz_num: number,
    category: string,
  ) {
    return await this.quizService.addCategoryToQuiz(
      file_num,
      quiz_num,
      category,
    );
  }

  @Put('/category')
  async removeCategoryFromQuiz(@Body() body: RemoveCategoryOfQuizDto) {
    return await this.quizService.removeCategoryFromQuiz(body);
  }

  @Put('/check')
  async check(file_num: number, quiz_num: number) {
    return await this.quizService.check(file_num, quiz_num);
  }

  @Delete('/check')
  async uncheck(file_num: number, quiz_num: number) {
    return await this.quizService.uncheck(file_num, quiz_num);
  }

  @Post('/check')
  async reverseCheck(file_num: number, quiz_num: number) {
    return await this.quizService.reverseCheck(file_num, quiz_num);
  }
}
