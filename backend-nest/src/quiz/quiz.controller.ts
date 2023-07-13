import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get('/file')
  async getFileList() {
    return await this.quizService.getFileList();
  }

  @Get()
  async getQuiz(file_num: number, quiz_num: number) {
    return await this.quizService.getQuiz(file_num, quiz_num);
  }

  @Get('/random')
  async getRandomQuiz(
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: boolean,
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
  async getWorstRateQuiz(file_num: number, category: string, checked: boolean) {
    return await this.quizService.getWorstRateQuiz(file_num, category, checked);
  }

  @Get('/minimum')
  async getMinimumAnsweredQuiz(
    file_num: number,
    category: string,
    checked: boolean,
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
    file_num: number,
    min_rate: number,
    max_rate: number,
    category: string,
    checked: boolean,
    query: string,
    cond: any,
  ) {
    return await this.quizService.search(
      file_num,
      min_rate,
      max_rate,
      category,
      checked,
      query,
      cond,
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

  @Delete('/category')
  async removeCategoryFromQuiz(
    file_num: number,
    quiz_num: number,
    category: string,
  ) {
    return await this.quizService.removeCategoryFromQuiz(
      file_num,
      quiz_num,
      category,
    );
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
