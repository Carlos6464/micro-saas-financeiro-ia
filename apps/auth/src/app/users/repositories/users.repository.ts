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
}