import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashingService } from '../hashing/hashing.service';
import { Tokens, JwtPayload } from '../interfaces/token.interface';
import type { IUsersRepository } from '../../users/repositories/users.repository.interface';

@Injectable()
export class RefreshTokenUseCase {
  constructor(
    @Inject('IUsersRepository')
    private readonly usersRepository: IUsersRepository,
    private readonly hashingService: HashingService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async execute(userId: number, rt: string): Promise<Tokens> {
    const user = await this.usersRepository.findByIdWithRefreshToken(userId);
    if (!user || !user.currentRefreshTokenHash) 
      throw new ForbiddenException('Acesso negado');

    const isRtValid = await this.hashingService.compare(rt, user.currentRefreshTokenHash);
    if (!isRtValid) throw new ForbiddenException('Acesso negado');

    const tokens = await this.generateTokens(user.id, user.email, user.roles);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  private async generateTokens(userId: number, email: string, roles: string[]): Promise<Tokens> {
    const payload: JwtPayload = { sub: userId, email, roles };

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

  private async updateRefreshTokenHash(userId: number, rt: string) {
    const hash = await this.hashingService.hash(rt);
    await this.usersRepository.updateRefreshToken(userId, hash);
  }
}