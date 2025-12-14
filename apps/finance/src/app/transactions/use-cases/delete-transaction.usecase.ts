import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITransactionsRepository } from '../repositories/transactions.repository.interface';

@Injectable()
export class DeleteTransactionUseCase {
  constructor(
    @Inject('ITransactionsRepository') private readonly transRepo: ITransactionsRepository
  ) {}

  async execute(userId: number, id: number) {
    const transaction = await this.transRepo.findById(id, userId);
    if (!transaction) throw new NotFoundException('Transação não encontrada.');
    
    await this.transRepo.delete(id, userId);
  }
}