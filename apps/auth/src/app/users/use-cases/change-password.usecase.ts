import { BadRequestException, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import type { IUsersRepository } from '../repositories/users.repository.interface';
import { HashingService } from '../../auth/hashing/hashing.service';
import { ChangePasswordDto } from '../../auth/dtos/change-password.dto';

@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject('IUsersRepository') private readonly usersRepo: IUsersRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(userId: number, dto: ChangePasswordDto) {
    // 1. Busca usuário com a senha (que é oculta)
    const user = await this.usersRepo.findByIdWithPassword(userId);
    if (!user) throw new BadRequestException('Usuário não encontrado');

    // 2. Valida senha antiga
    const isMatch = await this.hashingService.compare(dto.oldPassword, user.password);
    if (!isMatch) throw new ForbiddenException('Senha antiga incorreta');

    // 3. Hash da nova senha
    const newHash = await this.hashingService.hash(dto.newPassword);

    // 4. Atualiza senha E invalida Refresh Token (Segurança: Logout forçado em outros devices)
    await this.usersRepo.update(userId, { password: newHash });
    await this.usersRepo.updateRefreshToken(userId, null);

    return { message: 'Senha alterada com sucesso. Faça login novamente.' };
  }
}