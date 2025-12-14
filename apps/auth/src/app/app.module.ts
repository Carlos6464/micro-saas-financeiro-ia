import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // 1. Adicione ConfigService
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { BackendDatabaseModule } from '@backend/database';

import { AppController } from './app.controller';
import { AppService } from './app.service';

// Auth Imports
import { AuthController } from './auth/auth.controller';
import { RegisterUserUseCase } from './auth/use-cases/register-user.usecase';
import { LoginUseCase } from './auth/use-cases/login.usecase';
import { RefreshTokenUseCase } from './auth/use-cases/refresh-token.usecase';
import { HashingService } from './auth/hashing/hashing.service';
import { JwtStrategy } from './auth/strategies/jwt.strategy';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

// User Imports
import { UserEntity } from './users/entities/user.entity';
import { UsersRepository } from './users/repositories/users.repository';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BackendDatabaseModule.forRoot('DB_NAME_AUTH'),
    TypeOrmModule.forFeature([UserEntity]),
    
    
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'), // Agora ele pega a chave do .env
        signOptions: { expiresIn: '1d' }, // Opcional: define validade padrão
      }),
    }),
  ],
  controllers: [AppController, AuthController],
  providers: [
    AppService,
    HashingService,
    // Use Cases
    RegisterUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    // Security
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    // Repository
    {
      provide: 'IUsersRepository',
      useClass: UsersRepository,
    },
  ],
})
export class AppModule {}