import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { TaskDto } from '../dto/task.dto';

export function FindAllTasksByUserSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Listar tarefas do usuário autenticado',
      description: 'Retorna todas as tarefas pertencentes ao usuário do token.',
      tags: ['Tasks'],
    }),
    ApiBearerAuth(),
    ApiOkResponse({
      description: 'Tarefas retornadas com sucesso.',
      type: TaskDto,
      isArray: true,
    }),
  );
}
