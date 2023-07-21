import { Controller, Get, Put, Query } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(@Query('file_num') file_num: number) {
    return await this.categoryService.getCategoryList(file_num);
  }

  @Put()
  async replaceAllCategory(file_num: number) {
    return await this.categoryService.replaceAllCategory(file_num);
  }

  @Get('rate')
  async getAccuracyRateByCategory(@Query('file_num') file_num: number) {
    return await this.categoryService.getAccuracyRateByCategory(file_num);
  }
}
