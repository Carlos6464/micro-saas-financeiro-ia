import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersRepository } from './repositories/users.repository';
import { UsersController } from './users.controller'; // <--- Importe o Controller

// Use Cases
import { GetProfileUseCase } from './use-cases/get-profile.usecase';
import { UpdateUserUseCase } from './use-cases/update-user.usecase';
import { ChangePasswordUseCase } from './use-cases/change-password.usecase';
import { DeleteAccountUseCase } from './use-cases/delete-account.usecase';
import { AdminManageUsersUseCase } from './use-cases/admin-manage-users.usecase';
import { HashingService } from '../auth/hashing/hashing.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController], 
  providers: [
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
    HashingService, // Necessário para troca de senha
    // Registre os Use Cases
    GetProfileUseCase,
    UpdateUserUseCase,
    ChangePasswordUseCase,
    DeleteAccountUseCase,
    AdminManageUsersUseCase,
  ],
  exports: ['IUsersRepository'],
})
export class UsersModule {}