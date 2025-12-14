import { Column, Entity } from 'typeorm';
import { AbstractEntity } from '@backend/database'; // Importando da lib partilhada

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity {

  @Column({ length: 45 })
  name!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column({ length: 15, nullable: true }) // Telefone para o bot
  telefone!: string;

  @Column({ type: 'text', select: false }) // Senha protegida
  password!: string;

  @Column({ name: 'plan_id', nullable: true })
  planId!: number;

  @Column({ type: 'json', nullable: true }) 
  roles: string[] = ['user'];

  @Column({ name: 'is_active', default: true })
  isActive!: boolean;

  @Column({ name: 'rt_hash', type: 'text', nullable: true, select: false })
  currentRefreshTokenHash!: string;

  isAdmin(): boolean {
    return this.roles.includes('admin');
  }
}