import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { QuizFileService } from './file.service';
import {
  AddQuizFileApiRequest,
  addQuizFileApiRequestSchema,
  DeleteQuizFileApiRequest,
  deleteQuizFileApiRequestSchema,
  GetQuizFileStatisticsAPIRequestDto,
  getQuizFileStatisticsAPIRequestSchema,
  downloadQuizCsvAPIRequestSchema,
} from 'quizzer-lib';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import { Response } from 'express';
import { ZodValidationPipe } from '../../common/zodValidation.pipe';

@UseGuards(CognitoAuthGuard)
@ApiTags('クイズファイル')
@Controller('quiz/file')
export class QuizFileController {
  constructor(private readonly quizFileService: QuizFileService) {}

  @Get()
  @ApiOperation({
    summary: 'クイズファイル一覧取得',
    description: '登録されているクイズファイルの一覧を取得します。',
  })
  async getFileList() {
    return await this.quizFileService.getFileList();
  }

  @Get('statistics')
  @ApiOperation({
    summary: 'クイズファイル統計情報取得',
    description: '指定したクイズファイルの統計情報を取得します。',
  })
  async getFileStatistics(
    @Query(new ZodValidationPipe(getQuizFileStatisticsAPIRequestSchema))
    req: GetQuizFileStatisticsAPIRequestDto,
  ) {
    return await this.quizFileService.getFileStatisticsData(req);
  }

  @Post()
  @ApiOperation({
    summary: 'クイズファイル追加',
    description: '新しいクイズファイルを追加します。',
  })
  async addFile(
    @Body(new ZodValidationPipe(addQuizFileApiRequestSchema))
    req: AddQuizFileApiRequest,
  ) {
    return await this.quizFileService.addFile(req);
  }

  @Delete()
  @ApiOperation({
    summary: 'クイズファイル削除',
    description: '指定したクイズファイルを削除します。',
  })
  async deleteFile(
    @Body(new ZodValidationPipe(deleteQuizFileApiRequestSchema))
    req: DeleteQuizFileApiRequest,
  ) {
    return await this.quizFileService.deleteFile(req);
  }

  @Get('csv')
  @ApiOperation({
    summary: 'クイズファイルCSVダウンロード',
    description: '指定したクイズファイルの内容をCSV形式でダウンロードします。',
  })
  async downloadCsv(
    @Query(new ZodValidationPipe(downloadQuizCsvAPIRequestSchema))
    { file_num }: { file_num: number },
    @Res() res: Response,
  ) {
    const csv = await this.quizFileService.downloadCsv(file_num);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="data.csv"');
    res.send(csv);
  }
}
