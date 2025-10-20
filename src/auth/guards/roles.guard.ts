import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException(
        'Usuário não autenticado. Faça login para continuar.',
      );
    }

    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));

    if (!hasRole) {
      throw new ForbiddenException(
        'Acesso negado. Você não possui permissão para acessar este recurso.',
      );
    }

    return true;
  }
}
