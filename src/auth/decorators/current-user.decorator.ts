import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import AuthenticatedUser from '../dto/authenticated-user';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthenticatedUser => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.user as AuthenticatedUser;
  },
);
