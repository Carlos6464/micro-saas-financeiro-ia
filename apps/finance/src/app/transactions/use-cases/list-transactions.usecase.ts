import { Inject, Injectable } from '@nestjs/common';
import type { ITransactionsRepository } from '../repositories/transactions.repository.interface';
import { FilterTransactionDto } from '../dtos/filter-transaction.dto';

@Injectable()
export class ListTransactionsUseCase {
  constructor(
    @Inject('ITransactionsRepository') private readonly transRepo: ITransactionsRepository
  ) {}

  async execute(userId: number, filters: FilterTransactionDto) {
    return this.transRepo.findAll(userId, filters);
  }
}