import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import { IsBoolean, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateTaskDto {
  @ApiProperty()
  @IsString({ message: 'O nome da tarefa deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome da tarefa é obrigatório.' })
  name: string;

  @ApiProperty()
  @IsEnum(TaskPriority, { message: 'A prioridade informada é inválida.' })
  priority: TaskPriority;

  @ApiProperty()
  @IsBoolean({ message: 'O campo "finished" deve ser verdadeiro ou falso.' })
  finished: boolean;
}
