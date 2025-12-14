import { Inject, Injectable } from '@nestjs/common';
import type { ICategoriesRepository } from '../repositories/categories.repository.interface';
import { CategoryType } from '../entities/category.entity';

@Injectable()
export class SeedCategoriesUseCase {
  constructor(
    @Inject('ICategoriesRepository') private readonly repo: ICategoriesRepository
  ) {}

  async execute() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.repo.createMany([
        { name: 'Salário', type: CategoryType.INCOME, color: '#4CAF50', icon: 'cash' },
        { name: 'Alimentação', type: CategoryType.EXPENSE, color: '#F44336', icon: 'food' },
        { name: 'Transporte', type: CategoryType.EXPENSE, color: '#2196F3', icon: 'bus' },
        { name: 'Lazer', type: CategoryType.EXPENSE, color: '#FF9800', icon: 'party' },
        { name: 'Saúde', type: CategoryType.EXPENSE, color: '#9C27B0', icon: 'heart' },
      ]);
      console.log('✅ Seed de Categorias executado com sucesso.');
    }
  }
}