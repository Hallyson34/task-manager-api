import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { RegisterDto } from '../dto/register.dto';
import { AuthDto } from '../dto/auth.dto';

export function RegisterSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Registrar usuário',
      description: 'Cria um novo usuário e retorna o access token.',
      tags: ['Auth'],
    }),
    ApiBody({ type: RegisterDto }),
    ApiCreatedResponse({
      description: 'Usuário criado com sucesso.',
      type: AuthDto,
    }),
    ApiBadRequestResponse({
      description: 'Dados inválidos (ex.: senha menor que 6 caracteres).',
    }),
  );
}
