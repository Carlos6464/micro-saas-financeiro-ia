import { Inject, Injectable } from '@nestjs/common';
import type { IUsersRepository } from '../repositories/users.repository.interface';

@Injectable()
export class AdminManageUsersUseCase {
  constructor(@Inject('IUsersRepository') private readonly usersRepo: IUsersRepository) {}

  // Listar todos paginado
  async findAll(page = 1, limit = 10) {
    return this.usersRepo.findAll(page, limit);
  }

  // Banir ou Ativar manualmente
  async toggleStatus(userId: number, isActive: boolean) {
    return this.usersRepo.update(userId, { isActive });
  }
}