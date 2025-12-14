import { CategoryEntity } from '../entities/category.entity';

export interface ICategoriesRepository {
  create(data: Partial<CategoryEntity>): Promise<CategoryEntity>;
  findAllSystemAndUser(userId: number): Promise<CategoryEntity[]>;
  findById(id: number): Promise<CategoryEntity | null>;
  count(): Promise<number>;
  createMany(data: Partial<CategoryEntity>[]): Promise<CategoryEntity[]>;
}