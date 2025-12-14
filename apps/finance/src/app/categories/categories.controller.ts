import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { CreateCategoryUseCase } from './use-cases/create-category.usecase';
import { ListCategoriesUseCase } from './use-cases/list-categories.usecase';
import { CategoryEntity } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(
    private readonly createUseCase: CreateCategoryUseCase,
    private readonly listUseCase: ListCategoriesUseCase,
  ) {}

  @Get()
  async findAll(@Headers('x-user-id') userId: string) {
    // Em produção real, valide se o header existe ou use um Guard JWT compartilhado
    return this.listUseCase.execute(Number(userId));
  }

  @Post()
  async create(@Headers('x-user-id') userId: string, @Body() body: Partial<CategoryEntity>) {
    return this.createUseCase.execute(Number(userId), body);
  }
}