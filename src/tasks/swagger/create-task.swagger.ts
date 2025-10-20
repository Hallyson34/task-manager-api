import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskDto } from '../dto/task.dto';

export function CreateTaskSwagger(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Criar tarefa',
      description: 'Cria uma nova tarefa para o usuário autenticado.',
      tags: ['Tasks'],
    }),
    ApiBearerAuth(),
    ApiBody({ type: CreateTaskDto }),
    ApiCreatedResponse({ description: 'Tarefa criada.', type: TaskDto }),
    ApiBadRequestResponse({ description: 'Dados inválidos.' }),
  );
}
