import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';

// Modules
import { UsersModule } from '../users/users.module'; // Importa o módulo de usuários para validar credenciais

// Controllers
import { AuthController } from './auth.controller';

// Use Cases
import { RegisterUserUseCase } from './use-cases/register-user.usecase';
import { LoginUseCase } from './use-cases/login.usecase';
import { RefreshTokenUseCase } from './use-cases/refresh-token.usecase';

// Services & Strategies
import { HashingService } from './hashing/hashing.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    // Importamos UsersModule porque precisamos buscar o usuário para logar
    UsersModule, 
    PassportModule,
    ConfigModule, // Necessário para ler o .env no registerAsync
    
    // Configuração do JWT movida para cá
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use Cases
    RegisterUserUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    // Services
    HashingService,
    JwtStrategy,
  ],
  // Exportamos o HashingService e JwtModule caso outros módulos precisem
  exports: [HashingService, JwtModule],
})
export class AuthModule {}