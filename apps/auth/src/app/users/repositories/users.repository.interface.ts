import { UserEntity } from '../entities/user.entity';

export interface IUsersRepository {
  create(user: Partial<UserEntity>): Promise<UserEntity>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findById(id: number): Promise<UserEntity | null>;
  updateRefreshToken(id: number, rtHash: string | null): Promise<void>;
  findByIdWithRefreshToken(id: number): Promise<UserEntity | null>;

  findByIdWithPassword(id: number): Promise<UserEntity | null>; // Para checar senha antiga
  update(id: number, data: Partial<UserEntity>): Promise<UserEntity>;
  findAll(page: number, limit: number): Promise<{ data: UserEntity[]; total: number }>;
  softDelete(id: number): Promise<void>;
}