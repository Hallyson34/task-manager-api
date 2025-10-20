import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { UserDto } from '../dto/user.dto';

export function FindAllUsersSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar usuários',
      description: 'Retorna todos os usuários (apenas ADMIN).',
      tags: ['Users'],
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Lista de usuários retornada com sucesso.',
      type: UserDto,
      isArray: true,
    }),
    ApiForbiddenResponse({
      description: 'Acesso negado (role insuficiente).',
    }),
  );
}
