import { Inject, Injectable } from '@nestjs/common';
import type { ITransactionsRepository } from '../repositories/transactions.repository.interface';

@Injectable()
export class GetBalanceUseCase {
  constructor(
    @Inject('ITransactionsRepository') private readonly transRepo: ITransactionsRepository
  ) {}

  async execute(userId: number, startDate: string, endDate: string) {
    const balance = await this.transRepo.getBalance(userId, startDate, endDate);
    return { balance };
  }
}