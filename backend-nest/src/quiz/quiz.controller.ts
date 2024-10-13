import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import {
  ClearQuizAPIRequestDto,
  FailQuizAPIRequestDto,
  AddQuizAPIRequestDto,
  EditQuizAPIRequestDto,
  DeleteQuizAPIRequestDto,
  IntegrateToQuizAPIRequestDto,
  CheckQuizAPIRequestDto,
  DeleteAnswerLogOfFileApiRequestDto,
  AddCategoryToQuizAPIRequestDto,
  parseStrToBool,
  GetQuizAPIRequestDto,
  SearchQuizAPIRequestDto,
} from 'quizzer-lib';
import { GetQuizPipe } from './pipe/getQuiz.pipe';
import { SearchQuizPipe } from './pipe/searchQuiz.pipe';
// import { AuthGuard } from '../auth/auth.guard';

// @UseGuards(AuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Get()
  async getQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req);
  }

  @Get('/random')
  async getRandomQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'random');
  }

  @Get('/worst')
  async getWorstRateQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'worstRate');
  }

  @Get('/minimum')
  async getMinimumAnsweredQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'leastClear');
  }

  @Get('/lru')
  async getLRUQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'LRU');
  }

  @Get('/review')
  async getReviewQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'review');
  }

  @Post('/clear')
  async cleared(@Body() req: ClearQuizAPIRequestDto) {
    return await this.quizService.cleared(req);
  }

  @Post('/fail')
  async failed(@Body() req: FailQuizAPIRequestDto) {
    return await this.quizService.failed(req);
  }

  @Post('')
  async add(@Body() req: AddQuizAPIRequestDto) {
    return await this.quizService.add(req);
  }

  @Post('/edit')
  async edit(@Body() req: EditQuizAPIRequestDto) {
    return await this.quizService.edit(req);
  }

  @Get('/search')
  async search(@Query(SearchQuizPipe) req: SearchQuizAPIRequestDto) {
    return await this.quizService.search(req);
  }

  @Delete()
  async delete(@Body() req: DeleteQuizAPIRequestDto) {
    return await this.quizService.delete(req);
  }

  @Post('/integrate')
  async integrate(@Body() req: IntegrateToQuizAPIRequestDto) {
    return await this.quizService.integrate(req);
  }

  @Post('/category')
  async addCategoryToQuiz(@Body() body: AddCategoryToQuizAPIRequestDto) {
    return await this.quizService.addCategoryToQuiz(body);
  }

  @Put('/category')
  async removeCategoryFromQuiz(@Body() body: AddCategoryToQuizAPIRequestDto) {
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
  async deleteAnswerLogByFile(@Body() req: DeleteAnswerLogOfFileApiRequestDto) {
    return await this.quizService.deleteAnswerLogByFile(req);
  }

  @Get('format')
  async getQuizFormatList() {
    return await this.quizService.getQuizFormatList();
  }

  @Get('/statistics/week')
  async getAnswerLogStatisticsPastWeek() {
    return await this.quizService.getAnswerLogStatisticsPastWeek();
  }
}
