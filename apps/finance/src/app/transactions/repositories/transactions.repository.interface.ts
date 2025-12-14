import { TransactionEntity } from '../entities/transaction.entity';
import { FilterTransactionDto } from '../dtos/filter-transaction.dto';

export interface ITransactionsRepository {
  create(data: Partial<TransactionEntity>): Promise<TransactionEntity>;
  findAll(userId: number, filters: FilterTransactionDto): Promise<{ data: TransactionEntity[], total: number }>;
  findById(id: number, userId: number): Promise<TransactionEntity | null>;
  delete(id: number, userId: number): Promise<void>;
  getBalance(userId: number, startDate: string, endDate: string): Promise<number>;
}