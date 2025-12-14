import { Inject, Injectable } from '@nestjs/common';
import type { ICategoriesRepository } from '../repositories/categories.repository.interface';

@Injectable()
export class ListCategoriesUseCase {
  constructor(
    @Inject('ICategoriesRepository') private readonly repo: ICategoriesRepository
  ) {}

  async execute(userId: number) {
    return this.repo.findAllSystemAndUser(userId);
  }
}