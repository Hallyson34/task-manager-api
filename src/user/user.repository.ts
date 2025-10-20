import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma/prisma.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<UserDto[]> {
    return this.prisma.user.findMany({
      include: {
        tasks: true,
        roles: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
