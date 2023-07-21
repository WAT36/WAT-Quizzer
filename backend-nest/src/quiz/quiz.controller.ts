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
import {
  UpdateCategoryOfQuizDto,
  SelectQuizDto,
  AddQuizDto,
  IntegrateQuizDto,
  EditQuizDto,
} from './quiz.dto';

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
  async cleared(@Body() req: SelectQuizDto) {
    return await this.quizService.cleared(req);
  }

  @Post('/fail')
  async failed(@Body() req: SelectQuizDto) {
    return await this.quizService.failed(req);
  }

  @Post('/add')
  async add(@Body() req: AddQuizDto) {
    return await this.quizService.add(req);
  }

  @Post('/edit')
  async edit(@Body() req: EditQuizDto) {
    return await this.quizService.edit(req);
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
  async delete(@Body() req: SelectQuizDto) {
    return await this.quizService.delete(req);
  }

  @Post('/integrate')
  async integrate(@Body() req: IntegrateQuizDto) {
    return await this.quizService.integrate(req);
  }

  @Post('/category')
  async addCategoryToQuiz(@Body() body: UpdateCategoryOfQuizDto) {
    return await this.quizService.addCategoryToQuiz(body);
  }

  @Put('/category')
  async removeCategoryFromQuiz(@Body() body: UpdateCategoryOfQuizDto) {
    return await this.quizService.removeCategoryFromQuiz(body);
  }

  @Put('/check')
  async check(@Body() req: SelectQuizDto) {
    return await this.quizService.check(req);
  }

  @Put('/uncheck')
  async uncheck(@Body() req: SelectQuizDto) {
    return await this.quizService.uncheck(req);
  }

  @Post('/check')
  async reverseCheck(@Body() req: SelectQuizDto) {
    return await this.quizService.reverseCheck(req);
  }
}
