import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entidade e Repository
import { CategoryEntity } from './entities/category.entity';
import { CategoriesRepository } from './repositories/categories.repository';

// Use Cases
import { CreateCategoryUseCase } from './use-cases/create-category.usecase';
import { ListCategoriesUseCase } from './use-cases/list-categories.usecase';
import { SeedCategoriesUseCase } from './use-cases/seed-categories.usecase';

// Controller
import { CategoriesController } from './categories.controller';

@Module({
  imports: [
    // Registra a entidade neste escopo
    TypeOrmModule.forFeature([CategoryEntity]),
  ],
  controllers: [CategoriesController],
  providers: [
    // Registra a implementação do repositório
    { provide: 'ICategoriesRepository', useClass: CategoriesRepository },
    
    // Registra os Use Cases
    CreateCategoryUseCase,
    ListCategoriesUseCase,
    SeedCategoriesUseCase,
  ],
  // IMPORTANTE: Exportamos o Repositório para que o módulo de Transações possa usá-lo
  exports: ['ICategoriesRepository'],
})
export class CategoriesModule implements OnModuleInit {
  constructor(private readonly seedCategories: SeedCategoriesUseCase) {}

  async onModuleInit() {
    // O Seed roda quando este módulo inicia
    await this.seedCategories.execute();
  }
}