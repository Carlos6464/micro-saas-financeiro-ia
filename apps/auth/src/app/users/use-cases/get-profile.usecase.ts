import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUsersRepository }  from '../repositories/users.repository.interface';

@Injectable()
export class GetProfileUseCase {
  constructor(@Inject('IUsersRepository') private readonly usersRepo: IUsersRepository) {}

  async execute(userId: number) {
    const user = await this.usersRepo.findById(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }
}