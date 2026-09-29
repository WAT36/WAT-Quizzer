import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Patch,
  Post,
  Put,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
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
  GetQuizAPIRequestDto,
  SearchQuizAPIRequestDto,
  GetAnswerLogStatisticsAPIRequestDto,
} from 'quizzer-lib';
import { GetQuizPipe } from './pipe/getQuiz.pipe';
import { SearchQuizPipe } from './pipe/searchQuiz.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { GetAnswerLogStatisticsPipe } from './pipe/getAnswerLogStatistics.pipe';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('クイズ')
@UseGuards(CognitoAuthGuard)
@Controller('quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @ApiOperation({
    summary: 'クイズ取得',
    description: '指定した条件でクイズを1件取得します。',
  })
  @Get()
  async getQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req);
  }

  @ApiOperation({
    summary: 'ランダムクイズ取得',
    description: '指定した条件でランダムなクイズを1件取得します。',
  })
  @Get('/random')
  async getRandomQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'random');
  }

  @ApiOperation({
    summary: '正答率が低いクイズ取得',
    description: '正答率が最も低いクイズを1件取得します。',
  })
  @Get('/worst')
  async getWorstRateQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'worstRate');
  }

  @ApiOperation({
    summary: '最小回答数クイズ取得',
    description: '最も回答回数が少ないクイズを1件取得します。',
  })
  @Get('/minimum')
  async getMinimumAnsweredQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'leastClear');
  }

  @ApiOperation({
    summary: 'LRUクイズ取得',
    description: '最も長期間解かれていないクイズを1件取得します。',
  })
  @Get('/lru')
  async getLRUQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'LRU');
  }

  @ApiOperation({
    summary: '復習クイズ取得',
    description: '先日間違えたクイズを1件取得します。',
  })
  @Get('/review')
  async getReviewQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'review');
  }

  @ApiOperation({
    summary: '今日まだ解いてないクイズ取得',
    description: '今日まだ解いてないクイズを1件取得します。',
  })
  @Get('/remaining')
  async getRemainingQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'todayNotAnswered');
  }

  @ApiOperation({
    summary: '直近更新のあったクイズ取得',
    description:
      '更新日時(updated_at)が新しい順にクイズを取得します（出題数指定時は上位から指定件数）。',
  })
  @Get('/recent')
  async getRecentlyUpdatedQuiz(@Query(GetQuizPipe) req: GetQuizAPIRequestDto) {
    return await this.quizService.getQuiz(req, 'recentlyUpdated');
  }

  @ApiOperation({
    summary: 'クイズ正解登録',
    description: 'クイズを正解したことを記録します。',
  })
  @Post('/clear')
  async cleared(@Body() req: ClearQuizAPIRequestDto) {
    return await this.quizService.cleared(req);
  }

  @ApiOperation({
    summary: 'クイズ不正解登録',
    description: 'クイズを不正解としたことを記録します。',
  })
  @Post('/fail')
  async failed(@Body() req: FailQuizAPIRequestDto) {
    return await this.quizService.failed(req);
  }

  @ApiOperation({
    summary: 'クイズ追加',
    description: '新しいクイズを追加します。',
  })
  @Post('')
  async add(@Body() req: AddQuizAPIRequestDto) {
    return await this.quizService.add(req);
  }

  @ApiOperation({
    summary: 'クイズ編集',
    description: '既存のクイズを編集します。',
  })
  @Post('/edit')
  async edit(@Body() req: EditQuizAPIRequestDto) {
    return await this.quizService.edit(req);
  }

  @ApiOperation({
    summary: 'クイズ検索',
    description: '条件に合致するクイズを検索します。',
  })
  @Get('/search')
  async search(@Query(SearchQuizPipe) req: SearchQuizAPIRequestDto) {
    return await this.quizService.search(req);
  }

  @ApiOperation({
    summary: 'クイズ削除',
    description: '指定したクイズを削除します。',
  })
  @Delete()
  async delete(@Body() req: DeleteQuizAPIRequestDto) {
    return await this.quizService.delete(req);
  }

  @ApiOperation({
    summary: 'クイズ統合',
    description: '複数のクイズを統合します。',
  })
  @Post('/integrate')
  async integrate(@Body() req: IntegrateToQuizAPIRequestDto) {
    return await this.quizService.integrate(req);
  }

  @ApiOperation({
    summary: 'クイズにカテゴリ追加',
    description: 'クイズにカテゴリを追加します。',
  })
  @Post('/category')
  async addCategoryToQuiz(@Body() body: AddCategoryToQuizAPIRequestDto) {
    return await this.quizService.addCategoryToQuiz(body);
  }

  @ApiOperation({
    summary: 'クイズからカテゴリ削除',
    description: 'クイズからカテゴリを削除します。',
  })
  @Put('/category')
  async removeCategoryFromQuiz(@Body() body: AddCategoryToQuizAPIRequestDto) {
    return await this.quizService.removeCategoryFromQuiz(body);
  }

  @ApiOperation({
    summary: 'クイズチェック',
    description: 'クイズをチェック済みにします。',
  })
  @Put('/check')
  async check(@Body() req: CheckQuizAPIRequestDto) {
    return await this.quizService.check(req);
  }

  @ApiOperation({
    summary: 'クイズ未チェック',
    description: 'クイズを未チェック状態にします。',
  })
  @Put('/uncheck')
  async uncheck(@Body() req: CheckQuizAPIRequestDto) {
    return await this.quizService.uncheck(req);
  }

  @ApiOperation({
    summary: 'クイズチェック反転',
    description: 'クイズのチェック状態を反転します。',
  })
  @Post('/check')
  async reverseCheck(@Body() req: CheckQuizAPIRequestDto) {
    return await this.quizService.reverseCheck(req);
  }

  @ApiOperation({
    summary: 'ファイル単位の解答履歴削除',
    description: '指定したファイルに紐づく解答履歴を削除します。',
  })
  @Patch('/answer_log/file')
  async deleteAnswerLogByFile(@Body() req: DeleteAnswerLogOfFileApiRequestDto) {
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
    @Query(GetAnswerLogStatisticsPipe) req: GetAnswerLogStatisticsAPIRequestDto,
  ) {
    return await this.quizService.getAnswerLogStatistics(req);
  }

  @ApiOperation({
    summary: '四択クイズファイルアップロード',
    description: '四択クイズ用のファイルをアップロードします。',
  })
  @Post('/upload/fourchoice')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFourChoiceFile(@UploadedFile() file: Express.Multer.File) {
    return await this.quizService.uploadFourChoiceFile(file);
  }

  @ApiOperation({
    summary: 'クイズファイルアップロード',
    description: 'クイズデータのファイルをアップロードします。',
  })
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return await this.quizService.uploadFile(file);
  }

  @ApiOperation({
    summary: 'クイズ画像アップロード',
    description: 'クイズで使用する画像ファイルをアップロードします。',
  })
  @Post('/image/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadQuizImage(@UploadedFile() file: Express.Multer.File) {
    return await this.quizService.uploadQuizImage(file);
  }

  @ApiOperation({
    summary: 'クイズ画像ダウンロード',
    description: 'クイズ画像をbase64形式で取得します。',
  })
  @Get('/image')
  async downloadQuizImage(@Query('fileName') fileName: string) {
    try {
      const buffer = await this.quizService.downloadQuizImage(fileName);
      const base64 = buffer.toString('base64');
      let mimeType = 'image/png';
      if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
        mimeType = 'image/jpeg';
      } else if (fileName.endsWith('.gif')) {
        mimeType = 'image/gif';
      }
      return {
        base64,
        mimeType,
      };
    } catch (err) {
      console.error(err);
      throw new NotFoundException('File not found');
    }
  }

  @ApiOperation({
    summary: '正答率ヒストグラム取得',
    description: '指定ファイル番号の正答率ヒストグラムデータを取得します。',
  })
  @Get('/statistics/histgram')
  async getAccuracyRateHistgramData(@Query('file_num') file_num: string) {
    return await this.quizService.getAccuracyRateHistgramData(+file_num);
  }

  @ApiOperation({
    summary: 'おすすめカテゴリ取得',
    description:
      '最近解いていない、または最近の正解率が低いカテゴリを最大5件返します。',
  })
  @Get('/recommend-categories')
  async getRecommendedCategories(@Query('file_num') file_num: string) {
    return await this.quizService.getRecommendedCategories(+file_num);
  }
}
