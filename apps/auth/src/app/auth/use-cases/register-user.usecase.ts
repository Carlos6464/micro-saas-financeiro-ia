import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { HashingService } from '../hashing/hashing.service';
import * as usersRepositoryInterface from '../../users/repositories/users.repository.interface';
import { UserEntity } from '../../users/entities/user.entity';

@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject('IUsersRepository') // Injetamos pela interface para manter desacoplamento
    private readonly usersRepository: usersRepositoryInterface.IUsersRepository,
    private readonly hashingService: HashingService,
  ) {}

  async execute(dto: RegisterUserDto): Promise<Omit<UserEntity, 'password' | 'currentRefreshTokenHash'>> {
    // 1. Verificar se o usuário já existe
    const existingUser = await this.usersRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('Email já está em uso.');
    }

    // 2. Hash da senha
    const passwordHash = await this.hashingService.hash(dto.password);

    // 3. Criar o usuário
    // O plan_id começa null e is_active true por padrão na Entidade
    const newUser = await this.usersRepository.create({
      name: dto.name,
      email: dto.email,
      telefone: dto.telefone,
      password: passwordHash,
      roles: ['user'], // Role padrão
    });

    // 4. Remover dados sensíveis do retorno (embora o DTO de resposta seja ideal, aqui simplificamos)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, currentRefreshTokenHash, ...result } = newUser;
    return result as UserEntity;
  }
}