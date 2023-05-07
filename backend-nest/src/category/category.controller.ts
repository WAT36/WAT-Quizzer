import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(file_num: number) {
    return await this.categoryService.getCategoryList(file_num);
  }

  @Put()
  async replaceAllCategory(file_num: number) {
    return await this.categoryService.replaceAllCategory(file_num);
  }

  @Get('rate')
  async getAccuracyRateByCategory(file_num: number) {
    return await this.categoryService.getAccuracyRateByCategory(file_num);
  }
}
