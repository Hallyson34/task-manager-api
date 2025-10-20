import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { UpdateTaskDto } from '../dto/update-task.dto';
import { TaskDto } from '../dto/task.dto';

export function UpdateTaskSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Atualizar tarefa',
      description: 'Atualiza os dados de uma tarefa do usuário autenticado.',
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
    ApiBody({ type: UpdateTaskDto }),
    ApiOkResponse({ description: 'Tarefa atualizada.', type: TaskDto }),
    ApiBadRequestResponse({ description: 'Dados inválidos.' }),
  );
}
