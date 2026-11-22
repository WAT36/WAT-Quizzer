import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QuizService } from './quiz.service';
import { QuizCsvService } from './csv/quizCsv.service';
import { QuizImageService } from './image/quizImage.service';
import { QuizImageSearchService } from './image/search/quizImageSearch.service';
import { QuizImageImportService } from './image/import/quizImageImport.service';
import { QuizStatisticsService } from './statistics/quizStatistics.service';
import {
  ClearQuizAPIRequestDto,
  clearQuizAPIRequestSchema,
  FailQuizAPIRequestDto,
  failQuizAPIRequestSchema,
  AddQuizAPIRequestDto,
  addQuizAPIRequestSchema,
  EditQuizAPIRequestDto,
  editQuizAPIRequestSchema,
  DeleteQuizAPIRequestDto,
  deleteQuizAPIRequestSchema,
  IntegrateToQuizAPIRequestDto,
  integrateToQuizAPIRequestSchema,
  CheckQuizAPIRequestDto,
  checkQuizAPIRequestSchema,
  ReverseCheckQuizAPIRequestDto,
  reverseCheckQuizAPIRequestSchema,
  DeleteAnswerLogOfFileApiRequestDto,
  deleteAnswerLogOfFileApiRequestSchema,
  AddCategoryToQuizAPIRequestDto,
  addCategoryToQuizAPIRequestSchema,
  DeleteCategoryOfQuizAPIRequestDto,
  deleteCategoryOfQuizAPIRequestSchema,
  GetQuizAPIRequestParsedDto,
  getQuizAPIRequestSchema,
  SearchQuizAPIRequestParsedDto,
  searchQuizAPIRequestSchema,
  GetAnswerLogStatisticsAPIRequestDto,
  getAnswerLogStatisticsAPIRequestSchema,
  getAccuracyRateHistgramAPIRequestSchema,
  getRecommendedCategoriesAPIRequestSchema,
  searchImageCandidatesOfQuizAPIRequestSchema,
  ImportImageOfQuizAPIRequestDto,
  importImageOfQuizAPIRequestSchema,
} from 'quizzer-lib';
import { FileInterceptor } from '@nestjs/platform-express';
import { quizImageUploadOptions } from './image/quizImageUpload.options';
import { Express } from 'express';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from '../common/zodValidation.pipe';

// 問題取得APIのクエリの検証（出題方法ごとのAPIで共通）
const getQuizQueryPipe = new ZodValidationPipe(getQuizAPIRequestSchema);

@ApiTags('クイズ')
@UseGuards(CognitoAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(
    private readonly quizService: QuizService,
    private readonly quizCsvService: QuizCsvService,
    private readonly quizImageService: QuizImageService,
    private readonly quizImageSearchService: QuizImageSearchService,
    private readonly quizImageImportService: QuizImageImportService,
    private readonly quizStatisticsService: QuizStatisticsService,
  ) {}

  @ApiOperation({
    summary: 'クイズ取得',
    description: '指定した条件でクイズを1件取得します。',
  })
  @Get()
  async getQuiz(@Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto) {
    return await this.quizService.getQuiz(req);
  }

  @ApiOperation({
    summary: 'ランダムクイズ取得',
    description: '指定した条件でランダムなクイズを1件取得します。',
  })
  @Get('/random')
  async getRandomQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'random');
  }

  @ApiOperation({
    summary: '正答率が低いクイズ取得',
    description: '正答率が最も低いクイズを1件取得します。',
  })
  @Get('/worst')
  async getWorstRateQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'worstRate');
  }

  @ApiOperation({
    summary: '最小回答数クイズ取得',
    description: '最も回答回数が少ないクイズを1件取得します。',
  })
  @Get('/minimum')
  async getMinimumAnsweredQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'leastClear');
  }

  @ApiOperation({
    summary: 'LRUクイズ取得',
    description: '最も長期間解かれていないクイズを1件取得します。',
  })
  @Get('/lru')
  async getLRUQuiz(@Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto) {
    return await this.quizService.getQuiz(req, 'LRU');
  }

  @ApiOperation({
    summary: '復習クイズ取得',
    description: '先日間違えたクイズを1件取得します。',
  })
  @Get('/review')
  async getReviewQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'review');
  }

  @ApiOperation({
    summary: '今日まだ解いてないクイズ取得',
    description: '今日まだ解いてないクイズを1件取得します。',
  })
  @Get('/remaining')
  async getRemainingQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'todayNotAnswered');
  }

  @ApiOperation({
    summary: '直近更新のあったクイズ取得',
    description:
      '更新日時(updated_at)が新しい順にクイズを取得します（出題数指定時は上位から指定件数）。',
  })
  @Get('/recent')
  async getRecentlyUpdatedQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'recentlyUpdated');
  }

  @ApiOperation({
    summary: '忘却曲線に基づく復習クイズ取得',
    description:
      '間隔反復(連続正解の段階に応じて1/3/7/14/30/60/120日)で復習期日が来たクイズを、期日超過の度合い(経過日数÷間隔)が大きい順に取得します。未回答のクイズは対象外です。',
  })
  @Get('/spaced-review')
  async getSpacedReviewQuiz(
    @Query(getQuizQueryPipe) req: GetQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.getQuiz(req, 'spacedReview');
  }

  @ApiOperation({
    summary: 'クイズ正解登録',
    description: 'クイズを正解したことを記録します。',
  })
  @Post('/clear')
  async cleared(
    @Body(new ZodValidationPipe(clearQuizAPIRequestSchema))
    req: ClearQuizAPIRequestDto,
  ) {
    return await this.quizService.cleared(req);
  }

  @ApiOperation({
    summary: 'クイズ不正解登録',
    description: 'クイズを不正解としたことを記録します。',
  })
  @Post('/fail')
  async failed(
    @Body(new ZodValidationPipe(failQuizAPIRequestSchema))
    req: FailQuizAPIRequestDto,
  ) {
    return await this.quizService.failed(req);
  }

  @ApiOperation({
    summary: 'クイズ追加',
    description: '新しいクイズを追加します。',
  })
  @Post('')
  async add(
    @Body(new ZodValidationPipe(addQuizAPIRequestSchema))
    req: AddQuizAPIRequestDto,
  ) {
    return await this.quizService.add(req);
  }

  @ApiOperation({
    summary: 'クイズ編集',
    description: '既存のクイズを編集します。',
  })
  @Post('/edit')
  async edit(
    @Body(new ZodValidationPipe(editQuizAPIRequestSchema))
    req: EditQuizAPIRequestDto,
  ) {
    return await this.quizService.edit(req);
  }

  @ApiOperation({
    summary: 'クイズ検索',
    description: '条件に合致するクイズを検索します。',
  })
  @Get('/search')
  async search(
    @Query(new ZodValidationPipe(searchQuizAPIRequestSchema))
    req: SearchQuizAPIRequestParsedDto,
  ) {
    return await this.quizService.search(req);
  }

  @ApiOperation({
    summary: 'クイズ削除',
    description: '指定したクイズを削除します。',
  })
  @Delete()
  async delete(
    @Body(new ZodValidationPipe(deleteQuizAPIRequestSchema))
    req: DeleteQuizAPIRequestDto,
  ) {
    return await this.quizService.delete(req);
  }

  @ApiOperation({
    summary: 'クイズ統合',
    description: '複数のクイズを統合します。',
  })
  @Post('/integrate')
  async integrate(
    @Body(new ZodValidationPipe(integrateToQuizAPIRequestSchema))
    req: IntegrateToQuizAPIRequestDto,
  ) {
    return await this.quizService.integrate(req);
  }

  @ApiOperation({
    summary: 'クイズにカテゴリ追加',
    description: 'クイズにカテゴリを追加します。',
  })
  @Post('/category')
  async addCategoryToQuiz(
    @Body(new ZodValidationPipe(addCategoryToQuizAPIRequestSchema))
    body: AddCategoryToQuizAPIRequestDto,
  ) {
    return await this.quizService.addCategoryToQuiz(body);
  }

  @ApiOperation({
    summary: 'クイズからカテゴリ削除',
    description: 'クイズからカテゴリを削除します。',
  })
  @Put('/category')
  async removeCategoryFromQuiz(
    @Body(new ZodValidationPipe(deleteCategoryOfQuizAPIRequestSchema))
    body: DeleteCategoryOfQuizAPIRequestDto,
  ) {
    return await this.quizService.removeCategoryFromQuiz(body);
  }

  @ApiOperation({
    summary: 'クイズチェック',
    description: 'クイズをチェック済みにします。',
  })
  @Put('/check')
  async check(
    @Body(new ZodValidationPipe(checkQuizAPIRequestSchema))
    req: CheckQuizAPIRequestDto,
  ) {
    return await this.quizService.check(req);
  }

  @ApiOperation({
    summary: 'クイズ未チェック',
    description: 'クイズを未チェック状態にします。',
  })
  @Put('/uncheck')
  async uncheck(
    @Body(new ZodValidationPipe(checkQuizAPIRequestSchema))
    req: CheckQuizAPIRequestDto,
  ) {
    return await this.quizService.uncheck(req);
  }

  @ApiOperation({
    summary: 'クイズチェック反転',
    description: 'クイズのチェック状態を反転します。',
  })
  @Post('/check')
  async reverseCheck(
    @Body(new ZodValidationPipe(reverseCheckQuizAPIRequestSchema))
    req: ReverseCheckQuizAPIRequestDto,
  ) {
    return await this.quizService.reverseCheck(req);
  }

  @ApiOperation({
    summary: 'ファイル単位の解答履歴削除',
    description: '指定したファイルに紐づく解答履歴を削除します。',
  })
  @Patch('/answer_log/file')
  async deleteAnswerLogByFile(
    @Body(new ZodValidationPipe(deleteAnswerLogOfFileApiRequestSchema))
    req: DeleteAnswerLogOfFileApiRequestDto,
  ) {
    return await this.quizService.deleteAnswerLogByFile(req);
  }

  @ApiOperation({
    summary: 'クイズ形式一覧取得',
    description: '利用可能なクイズ形式の一覧を取得します。',
  })
  @Get('format')
  async getQuizFormatList() {
    return await this.quizService.getQuizFormatList();
  }

  @ApiOperation({
    summary: '解答履歴統計取得',
    description: '指定条件の解答履歴統計情報を取得します。',
  })
  @Get('/statistics')
  async getAnswerLogStatistics(
    @Query(new ZodValidationPipe(getAnswerLogStatisticsAPIRequestSchema))
    req: GetAnswerLogStatisticsAPIRequestDto,
  ) {
    return await this.quizStatisticsService.getAnswerLogStatistics(req);
  }

  @ApiOperation({
    summary: '四択クイズファイルアップロード',
    description: '四択クイズ用のファイルをアップロードします。',
  })
  @Post('/upload/fourchoice')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFourChoiceFile(@UploadedFile() file: Express.Multer.File) {
    return await this.quizCsvService.uploadFourChoiceFile(file);
  }

  @ApiOperation({
    summary: 'クイズファイルアップロード',
    description: 'クイズデータのファイルをアップロードします。',
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.quizCsvService.uploadFile(file);
  }

  @ApiOperation({
    summary: 'クイズ画像アップロード',
    description: 'クイズで使用する画像ファイルをアップロードします。',
  })
  @Post('/image/upload')
  @UseInterceptors(FileInterceptor('file', quizImageUploadOptions))
  async uploadQuizImage(@UploadedFile() file: Express.Multer.File) {
    return await this.quizImageService.uploadQuizImage(file);
  }

  @ApiOperation({
    summary: 'クイズ画像ダウンロード',
    description: 'クイズ画像をbase64形式で取得します。',
  })
  @Get('/image')
  async downloadQuizImage(@Query('fileName') fileName: string) {
    return await this.quizImageService.downloadQuizImage(fileName);
  }

  @ApiOperation({
    summary: 'クイズ画像の候補検索',
    description:
      '問題文と答えから、参考画像の候補をWebで探して返します（OpenAIの画像検索を使用）。',
  })
  @Get('/image/candidates')
  async searchImageCandidates(
    @Query(new ZodValidationPipe(searchImageCandidatesOfQuizAPIRequestSchema))
    req: {
      quiz_id: number;
      hint?: string;
    },
  ) {
    return await this.quizImageSearchService.searchCandidates(req);
  }

  @ApiOperation({
    summary: 'クイズ画像の候補を登録',
    description:
      '画像の候補検索で返した画像をダウンロードしてS3に保存し、問題に紐付けます。',
  })
  @Post('/image/import')
  async importImage(
    @Body(new ZodValidationPipe(importImageOfQuizAPIRequestSchema))
    req: ImportImageOfQuizAPIRequestDto,
  ) {
    return await this.quizImageImportService.importImage(req);
  }

  @ApiOperation({
    summary: '正答率ヒストグラム取得',
    description: '指定ファイル番号の正答率ヒストグラムデータを取得します。',
  })
  @Get('/statistics/histgram')
  async getAccuracyRateHistgramData(
    @Query(new ZodValidationPipe(getAccuracyRateHistgramAPIRequestSchema))
    { file_num }: { file_num: number },
  ) {
    return await this.quizStatisticsService.getAccuracyRateHistgramData(
      file_num,
    );
  }

  @ApiOperation({
    summary: 'おすすめカテゴリ取得',
    description:
      '最近解いていない、または最近の正解率が低いカテゴリを最大5件返します。',
  })
  @Get('/recommend-categories')
  async getRecommendedCategories(
    @Query(new ZodValidationPipe(getRecommendedCategoriesAPIRequestSchema))
    { file_num }: { file_num: number },
  ) {
    return await this.quizStatisticsService.getRecommendedCategories(file_num);
  }
}
