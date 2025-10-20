import { applyDecorators } from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { AuthDto } from '../dto/auth.dto';

export function LoginSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Login',
      description:
        'Autentica o usuário e retorna um access token com o usuário encontrado.',
      tags: ['Auth'],
    }),
    ApiBody({ type: LoginDto }),
    ApiOkResponse({
      description: 'Login realizado com sucesso.',
      type: AuthDto,
    }),
    ApiBadRequestResponse({
      description: 'Requisição inválida (ex.: email mal formatado).',
    }),
    ApiUnauthorizedResponse({
      description: 'Credenciais inválidas.',
    }),
  );
}
