import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { ITransactionsRepository } from '../repositories/transactions.repository.interface';
import type { ICategoriesRepository } from '../../categories/repositories/categories.repository.interface';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject('ITransactionsRepository') private readonly transRepo: ITransactionsRepository,
    @Inject('ICategoriesRepository') private readonly catRepo: ICategoriesRepository,
  ) {}

  async execute(userId: number, dto: CreateTransactionDto) {
    const category = await this.catRepo.findById(dto.categoryId);
    if (!category) throw new NotFoundException('Categoria inválida ou não encontrada.');

    return this.transRepo.create({ ...dto, userId });
  }
}