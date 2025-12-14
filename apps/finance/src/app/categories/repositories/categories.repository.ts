import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { ICategoriesRepository } from './categories.repository.interface';

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly repo: Repository<CategoryEntity>,
  ) {}

  async create(data: Partial<CategoryEntity>): Promise<CategoryEntity> {
    const category = this.repo.create(data);
    return this.repo.save(category);
  }

  async findAllSystemAndUser(userId: number): Promise<CategoryEntity[]> {
    return this.repo.createQueryBuilder('c')
      .where('c.isActive = :isActive', { isActive: true })
      .andWhere('(c.userId IS NULL OR c.userId = :userId)', { userId })
      .orderBy('c.name', 'ASC')
      .getMany();
  }

  async findById(id: number): Promise<CategoryEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async count(): Promise<number> {
    return this.repo.count();
  }

  async createMany(data: Partial<CategoryEntity>[]): Promise<CategoryEntity[]> {
    const entities = this.repo.create(data);
    return this.repo.save(entities);
  }
}