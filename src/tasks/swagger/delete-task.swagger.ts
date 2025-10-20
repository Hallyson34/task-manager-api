import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';

export function DeleteTaskSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Excluir tarefa',
      description: 'Exclui uma tarefa do usuário autenticado.',
      tags: ['Tasks'],
    }),
    ApiBearerAuth(),
    ApiParam({
      name: 'id',
      description: 'ID da tarefa',
      type: Number,
      required: true,
      example: 123,
    }),
    ApiOkResponse({ description: 'Tarefa excluída com sucesso.' }),
  );
}
