import { Inject, Injectable } from '@nestjs/common';
import type { ICategoriesRepository } from '../repositories/categories.repository.interface';
import { CategoryEntity } from '../entities/category.entity';

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject('ICategoriesRepository') private readonly repo: ICategoriesRepository
  ) {}

  async execute(userId: number, data: Partial<CategoryEntity>) {
    return this.repo.create({ ...data, userId });
  }
}