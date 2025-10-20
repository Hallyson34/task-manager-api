import { ApiProperty } from '@nestjs/swagger';
import { TaskPriority } from '@prisma/client';

export class TaskDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  priority: TaskPriority;

  @ApiProperty()
  finished: boolean;

  @ApiProperty()
  createdAt: Date;
}
