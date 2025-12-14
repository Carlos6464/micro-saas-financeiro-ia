import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Importamos o Módulo de Categorias (para validar FK)
import { CategoriesModule } from '../categories/categories.module';

// Entidade e Repository
import { TransactionEntity } from './entities/transaction.entity';
import { TransactionsRepository } from './repositories/transactions.repository';

// Use Cases
import { CreateTransactionUseCase } from './use-cases/create-transaction.usecase';
import { ListTransactionsUseCase } from './use-cases/list-transactions.usecase';
import { DeleteTransactionUseCase } from './use-cases/delete-transaction.usecase';
import { GetBalanceUseCase } from './use-cases/get-balance.usecase';

// Controller
import { TransactionsController } from './transactions.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransactionEntity]),
    // 👇 Importamos aqui para usar o 'ICategoriesRepository' que foi exportado lá
    CategoriesModule, 
  ],
  controllers: [TransactionsController],
  providers: [
    { provide: 'ITransactionsRepository', useClass: TransactionsRepository },

    CreateTransactionUseCase,
    ListTransactionsUseCase,
    DeleteTransactionUseCase,
    GetBalanceUseCase,
  ],
})
export class TransactionsModule {}