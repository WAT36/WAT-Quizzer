import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CategoryService } from './category.service';
import { ReplaceAllCategorAPIRequestDto } from 'quizzer-lib';
import { AuthGuard } from '../auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(@Query('file_num') file_num: number) {
    return await this.categoryService.getCategoryList(+file_num);
  }

  @Post()
  async replaceAllCategory(@Body() req: ReplaceAllCategorAPIRequestDto) {
    return await this.categoryService.replaceAllCategory(req);
  }

  @Get('rate')
  async getAccuracyRateByCategory(@Query('file_num') file_num: number) {
    return await this.categoryService.getAccuracyRateByCategory(+file_num);
  }
}
