import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TransactionEntity } from '../entities/transaction.entity';
import { ITransactionsRepository } from './transactions.repository.interface';
import { FilterTransactionDto } from '../dtos/filter-transaction.dto';

@Injectable()
export class TransactionsRepository implements ITransactionsRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
  ) {}

  async create(data: Partial<TransactionEntity>): Promise<TransactionEntity> {
    const transaction = this.repo.create(data);
    return this.repo.save(transaction);
  }

  async findAll(userId: number, filters: FilterTransactionDto): Promise<{ data: TransactionEntity[]; total: number }> {
    const { startDate, endDate, categoryId, page = 1, limit = 10 } = filters;

    const query = this.repo.createQueryBuilder('t')
      .leftJoinAndSelect('t.category', 'category')
      .where('t.userId = :userId', { userId });

    if (startDate && endDate) {
      query.andWhere('t.date BETWEEN :start AND :end', { start: startDate, end: endDate });
    }

    if (categoryId) {
      query.andWhere('t.categoryId = :categoryId', { categoryId });
    }

    const [data, total] = await query
      .orderBy('t.date', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { data, total };
  }

  async findById(id: number, userId: number): Promise<TransactionEntity | null> {
    return this.repo.findOneBy({ id, userId });
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.repo.delete({ id, userId });
  }

  async getBalance(userId: number, startDate: string, endDate: string): Promise<number> {
    const { sum } = await this.repo.createQueryBuilder('t')
      .where('t.userId = :userId', { userId })
      .andWhere('t.date BETWEEN :start AND :end', { start: startDate, end: endDate })
      .select('SUM(t.amount)', 'sum')
      .getRawOne();
    
    return parseFloat(sum || '0');
  }
}