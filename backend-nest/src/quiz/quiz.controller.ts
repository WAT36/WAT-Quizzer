import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  IntegrateQuizAPIRequestDto,
  UpdateCategoryOfQuizAPIRequestDto,
  RemoveCategoryOfQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteAnswerLogAPIRequestDto,
} from 'quizzer-lib';

@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuiz(
    @Query('file_num') file_num: number,
    @Query('quiz_num') quiz_num: number,
    @Query('format') format: string,
  ) {
    return await this.quizService.getQuiz(+file_num, +quiz_num, format);
  }

  @Get('/random')
  async getRandomQuiz(
    @Query('file_num') file_num: number,
    @Query('min_rate') min_rate: number,
    @Query('max_rate') max_rate: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
    @Query('format') format: string,
  ) {
    return await this.quizService.getRandomQuiz(
      file_num,
      min_rate,
      max_rate,
      category,
      checked,
      format,
    );
  }

  @Get('/worst')
  async getWorstRateQuiz(
    @Query('file_num') file_num: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
    @Query('format') format: string,
  ) {
    return await this.quizService.getWorstRateQuiz(
      file_num,
      category,
      checked,
      format,
    );
  }

  @Get('/minimum')
  async getMinimumAnsweredQuiz(
    @Query('file_num') file_num: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
    @Query('format') format: string,
  ) {
    return await this.quizService.getMinimumAnsweredQuiz(
      file_num,
      category,
      checked,
      format,
    );
  }

  @Get('/lru')
  async getLRUQuiz(
    @Query('file_num') file_num: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
    @Query('format') format: string,
  ) {
    return await this.quizService.getLRUQuiz(
      file_num,
      category,
      checked,
      format,
    );
  }

  @Get('/review')
  async getReviewQuiz(
    @Query('file_num') file_num: number,
    @Query('category') category: string,
    @Query('checked') checked: string,
    @Query('format') format: string,
  ) {
    return await this.quizService.getReviewQuiz(
      file_num,
      category,
      checked,
      format,
    );
  }

  @Post('/clear')
  async cleared(@Body() req: ClearQuizAPIRequestDto) {
    return await this.quizService.cleared(req);
  }

  @Post('/fail')
  async failed(@Body() req: FailQuizAPIRequestDto) {
    return await this.quizService.failed(req);
  }

  @Post('/add')
  async add(@Body() req: AddQuizAPIRequestDto) {
    return await this.quizService.add(req);
  }

  @Post('/edit')
  async edit(@Body() req: EditQuizAPIRequestDto) {
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
    @Query('format') format: string,
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
      format,
    );
  }

  @Delete()
  async delete(@Body() req: DeleteQuizAPIRequestDto) {
    return await this.quizService.delete(req);
  }

  @Post('/integrate')
  async integrate(@Body() req: IntegrateQuizAPIRequestDto) {
    return await this.quizService.integrate(req);
  }

  @Post('/category')
  async addCategoryToQuiz(@Body() body: UpdateCategoryOfQuizAPIRequestDto) {
    return await this.quizService.addCategoryToQuiz(body);
  }

  @Put('/category')
  async removeCategoryFromQuiz(
    @Body() body: RemoveCategoryOfQuizAPIRequestDto,
  ) {
    return await this.quizService.removeCategoryFromQuiz(body);
  }

  @Put('/check')
  async check(@Body() req: CheckQuizAPIRequestDto) {
    return await this.quizService.check(req);
  }

  @Put('/uncheck')
  async uncheck(@Body() req: CheckQuizAPIRequestDto) {
    return await this.quizService.uncheck(req);
  }

  @Post('/check')
  async reverseCheck(@Body() req: CheckQuizAPIRequestDto) {
    return await this.quizService.reverseCheck(req);
  }

  @Patch('/answer_log/file')
  async deleteAnswerLogByFile(@Body() req: DeleteAnswerLogAPIRequestDto) {
    return await this.quizService.deleteAnswerLogByFile(req);
  }

  @Post('/advanced')
  async addAdvanceQuiz(@Body() req: AddQuizAPIRequestDto) {
    return await this.quizService.addAdvancedQuiz(req);
  }

  @Post('/advanced/4choice')
  async addFourChoiceQuiz(@Body() req: AddQuizAPIRequestDto) {
    return await this.quizService.addFourChoiceQuiz(req);
  }
}
