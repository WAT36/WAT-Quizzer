import { Controller, Delete, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getCategory(file_num: number) {
    return await this.categoryService.getCategoryList(file_num);
  }
}
