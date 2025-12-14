import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@backend/database';

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
}

@Entity({ name: 'categories' })
export class CategoryEntity extends AbstractEntity {
  @Column()
  name!: string;

  @Column({ nullable: true })
  color?: string;

  @Column({ nullable: true })
  icon?: string;

  @Column({ type: 'enum', enum: CategoryType })
  type!: CategoryType;

  // Se NULL = Categoria Padrão do Sistema. Se preenchido = Categoria Personalizada.
  @Column({ name: 'user_id', nullable: true })
  userId?: number;

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;
}