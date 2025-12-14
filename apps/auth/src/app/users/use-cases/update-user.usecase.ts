import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import type { IUsersRepository } from '../repositories/users.repository.interface';
import { UpdateUserDto } from '../../auth/dtos/update-user.dto';

@Injectable()
export class UpdateUserUseCase {
  constructor(@Inject('IUsersRepository') private readonly usersRepo: IUsersRepository) {}

  async execute(userId: number, data: UpdateUserDto) {
    // 1. Se alterou e-mail, verifica se já existe
    if (data.email) {
      const emailExists = await this.usersRepo.findByEmail(data.email);
      if (emailExists && emailExists.id !== userId) {
        throw new BadRequestException('Este e-mail já está em uso por outro usuário.');
      }
    }

    // 2. Atualiza (ID e Roles não são passados no DTO, então é seguro)
    return this.usersRepo.update(userId, data);
  }
}