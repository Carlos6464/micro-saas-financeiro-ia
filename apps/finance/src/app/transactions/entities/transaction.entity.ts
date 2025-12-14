import { Column, Entity, JoinColumn, ManyToOne, Index } from 'typeorm';
import { AbstractEntity } from '@backend/database';
import { CategoryEntity } from '../../categories/entities/category.entity';

@Entity({ name: 'transactions' })
@Index(['userId', 'date']) // Índice para performance de filtro
export class TransactionEntity extends AbstractEntity {
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount!: number;

  @Column({ type: 'date' })
  date!: string; // YYYY-MM-DD

  @Column()
  description!: string;

  @Column({ name: 'user_id' })
  userId!: number;

  @Column({ name: 'category_id' })
  categoryId!: number;

  @ManyToOne(() => CategoryEntity)
  @JoinColumn({ name: 'category_id' })
  category!: CategoryEntity;
}