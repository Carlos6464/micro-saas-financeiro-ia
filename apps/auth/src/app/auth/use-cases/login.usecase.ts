import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dtos/login.dto';
import { Tokens, JwtPayload } from '../interfaces/token.interface';
import { HashingService } from '../hashing/hashing.service';
import { UserEntity } from '../../users/entities/user.entity';
// CORREÇÃO AQUI: import type
import type { IUsersRepository } from '../../users/repositories/users.repository.interface';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(dto: LoginDto): Promise<Tokens> {
    const user = await this.usersRepository.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const isPasswordValid = await this.hashingService.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Credenciais inválidas');

    const tokens = await this.generateTokens(user);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(user: UserEntity): Promise<Tokens> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      roles: user.roles,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    ]);

    return { accessToken: at, refreshToken: rt };
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string): Promise<void> {
    const hash = await this.hashingService.hash(refreshToken);
    await this.usersRepository.updateRefreshToken(userId, hash);
  }
}