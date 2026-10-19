import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CognitoAuthGuard } from 'src/auth/cognito/cognito-auth.guard';
import {
  AccuracyRateQueryPipe,
  AccuracyRateQueryDto,
} from './pipes/accuracy-rate-query.pipe';

@ApiTags('カテゴリ')
@UseGuards(CognitoAuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @ApiOperation({
    summary: 'カテゴリ一覧取得',
    description: '指定されたファイル番号に対応するカテゴリ一覧を取得します。',
  })
  @ApiQuery({
    name: 'file_num',
    description: 'ファイル番号',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'カテゴリ一覧の取得に成功しました。',
  })
  @ApiResponse({
    status: 400,
    description: 'リクエストパラメータが不正です。',
  })
  @ApiResponse({
    status: 401,
    description: '認証が必要です。',
  })
  @Get()
  async getCategory(@Query('file_num', ParseIntPipe) file_num: number) {
    return await this.categoryService.getCategoryList(+file_num);
  }

  @ApiOperation({
    summary: 'カテゴリ別正答率取得',
    description: '指定されたファイル番号の各カテゴリ別の正答率を取得します。',
  })
  @ApiQuery({
    name: 'file_num',
    description: 'ファイル番号',
    type: Number,
    required: true,
  })
  @ApiQuery({
    name: 'startDate',
    description: '開始日（yyyy-mm-dd形式）',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'endDate',
    description: '終了日（yyyy-mm-dd形式）',
    type: String,
    required: false,
  })
  @ApiQuery({
    name: 'format_id',
    description: '問題形式ID（カンマ区切り）',
    type: String,
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'カテゴリ別正答率の取得に成功しました。',
  })
  @ApiResponse({
    status: 400,
    description: 'リクエストパラメータが不正です。',
  })
  @ApiResponse({
    status: 401,
    description: '認証が必要です。',
  })
  @Get('rate')
  @UsePipes(AccuracyRateQueryPipe)
  async getAccuracyRateByCategory(@Query() query: AccuracyRateQueryDto) {
    return await this.categoryService.getAccuracyRateByCategory(
      query.file_num,
      query.startDate,
      query.endDate,
      query.format_id,
    );
  }

  @ApiOperation({
    summary: 'カテゴリ別問題数取得',
    description:
      '指定されたファイル番号の各カテゴリに登録されている問題数を取得します。',
  })
  @ApiQuery({
    name: 'file_num',
    description: 'ファイル番号',
    type: Number,
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'カテゴリ別問題数の取得に成功しました。',
  })
  @Get('count')
  async getCategoryQuizCount(
    @Query('file_num', ParseIntPipe) file_num: number,
  ) {
    return await this.categoryService.getCategoryQuizCount(+file_num);
  }

  @ApiOperation({
    summary: 'カテゴリ親子関係一覧取得',
    description: '指定されたファイル番号のカテゴリ親子関係一覧を取得します。',
  })
  @ApiQuery({
    name: 'file_num',
    description: 'ファイル番号',
    type: Number,
    required: true,
  })
  @Get('parent-child')
  async getCategoryParentChildList(
    @Query('file_num', ParseIntPipe) file_num: number,
  ) {
    return await this.categoryService.getCategoryParentChildList(+file_num);
  }

  @ApiOperation({
    summary: 'カテゴリ親子関係追加',
    description: 'カテゴリの親子関係を新規追加します。',
  })
  @Post('parent-child')
  async addCategoryParentChild(
    @Body()
    body: {
      file_num: number;
      parent_category: string;
      child_category: string;
    },
  ) {
    return await this.categoryService.addCategoryParentChild(
      body.file_num,
      body.parent_category,
      body.child_category,
    );
  }

  @ApiOperation({
    summary: 'カテゴリ親子関係削除',
    description: '指定されたIDのカテゴリ親子関係を削除します。',
  })
  @Delete('parent-child')
  async deleteCategoryParentChild(@Body() body: { id: number }) {
    return await this.categoryService.deleteCategoryParentChild(body.id);
  }

  @ApiOperation({
    summary: '空カテゴリ整理',
    description: '問題が一件も紐付いていないカテゴリを論理削除します。',
  })
  @ApiResponse({
    status: 200,
    description: '削除されたカテゴリ件数を返します。',
  })
  @Delete('cleanup')
  async cleanupEmptyCategories() {
    return await this.categoryService.cleanupEmptyCategories();
  }
}
