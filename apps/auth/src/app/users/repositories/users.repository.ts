import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { IUsersRepository } from './users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeOrmRepository: Repository<UserEntity>,
  ) {}

  async create(data: Partial<UserEntity>): Promise<UserEntity> {
    const user = this.typeOrmRepository.create(data);
    return await this.typeOrmRepository.save(user);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.typeOrmRepository.findOne({ 
      where: { email },
      select: ['id', 'email', 'password', 'roles', 'name', 'planId', 'isActive', 'telefone'] // Explicitamos password pois estava select:false
    });
  }

  async findById(id: number): Promise<UserEntity | null> {
    return await this.typeOrmRepository.findOne({ where: { id } });
  }

  async updateRefreshToken(id: number, rtHash: string): Promise<void> {
    await this.typeOrmRepository.update(id, { currentRefreshTokenHash: rtHash });
  }

  async findByIdWithRefreshToken(id: number): Promise<UserEntity | null> {
    return this.typeOrmRepository.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.currentRefreshTokenHash') 
      .getOne();
  }

  async findByIdWithPassword(id: number): Promise<UserEntity | null> {
    return this.typeOrmRepository.createQueryBuilder('user')
      .where('user.id = :id', { id })
      .addSelect('user.password') // Força trazer a senha
      .getOne();
  }

  // Novo: Atualização Genérica
  async update(id: number, data: Partial<UserEntity>): Promise<UserEntity> {
    await this.typeOrmRepository.update(id, data);
    return this.typeOrmRepository.findOneByOrFail({ id });
  }

  // Novo: Listagem Paginada
  async findAll(page: number, limit: number): Promise<{ data: UserEntity[]; total: number }> {
    const [data, total] = await this.typeOrmRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' }
    });
    return { data, total };
  }

  // Novo: Soft Delete (Desativar conta)
  async softDelete(id: number): Promise<void> {
    // Podemos usar o isActive ou softRemove do TypeORM. 
    // Vamos usar isActive conforme seu requisito de "Banir/Ativar" e "Delete"
    await this.typeOrmRepository.update(id, { isActive: false });
  }
}