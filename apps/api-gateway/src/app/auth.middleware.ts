/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Token de autenticação não fornecido.');
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Formato de token inválido.');
    }

    try {
      // 1. Valida a assinatura e expiração usando o SEGREDO do .env
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });

      // 2. Extrai o ID do usuário (geralmente salvo em 'sub' no token)
      // Se no seu Auth você salvou como 'id', mude para payload.id
      const userId = payload.sub; 

      // 3. Injeta o ID no Header para os próximos serviços
      req.headers['x-user-id'] = userId.toString();

      console.log(`🔐 [Gateway] Acesso liberado para User ID: ${userId}`);
      
      next();
    } catch (error: any) {
      console.error('❌ [Gateway] Token inválido:', error.message);
      throw new UnauthorizedException('Sessão expirada ou inválida. Faça login novamente.');
    }
  }
}