import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskDto } from './dto/task.dto';
import removeUndefinedAttributes from 'src/utils/remove-undefined-attributes';

@Injectable()
export class TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: number): Promise<TaskDto[]> {
    return this.prisma.task.findMany({
      where: { userId },
      orderBy: [{ finished: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async create(userId: number, data: CreateTaskDto): Promise<TaskDto> {
    return this.prisma.task.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async update(
    taskId: number,
    userId: number,
    data: UpdateTaskDto,
  ): Promise<TaskDto> {
    const task = await this.prisma.task.findFirst({
      where: { id: taskId, userId },
    });

    if (!task) throw new NotFoundException('Tarefa não encontrada.');

    const filteredData = removeUndefinedAttributes(data);

    return this.prisma.task.update({
      where: { id: task.id },
      data: filteredData,
    });
  }

  async delete(taskId: number, userId: number): Promise<number> {
    const result = await this.prisma.task.deleteMany({
      where: { id: taskId, userId },
    });
    return result.count;
  }
}
