import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateTaskDto {
  @ApiProperty()
  @IsOptional()
  @IsString({ message: 'O nome da tarefa deve ser um texto.' })
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsEnum(TaskPriority, { message: 'A prioridade informada é inválida.' })
  priority?: TaskPriority;

  @ApiProperty()
  @IsOptional()
  @IsBoolean({ message: 'O campo "finished" deve ser verdadeiro ou falso.' })
  finished?: boolean;
}
