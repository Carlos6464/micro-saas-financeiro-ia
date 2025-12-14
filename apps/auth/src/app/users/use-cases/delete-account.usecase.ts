import { Inject, Injectable } from '@nestjs/common';
import type { IUsersRepository } from '../repositories/users.repository.interface';

@Injectable()
export class DeleteAccountUseCase {
  constructor(@Inject('IUsersRepository') private readonly usersRepo: IUsersRepository) {}

  async execute(userId: number) {
    await this.usersRepo.softDelete(userId);
    // Opcional: Invalidar token também
    await this.usersRepo.updateRefreshToken(userId, null);
    return { message: 'Conta desativada com sucesso.' };
  }
}