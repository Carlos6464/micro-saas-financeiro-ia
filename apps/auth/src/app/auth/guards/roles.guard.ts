import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    // Se a rota não exige roles, libera
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    // Se o usuário não tem roles ou não bate com a necessária
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    
    if (!hasRole) {
      throw new ForbiddenException('Acesso restrito a administradores');
    }

    return true;
  }
}