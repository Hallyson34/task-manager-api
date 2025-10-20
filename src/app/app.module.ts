import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from '../config/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { TaskModule } from 'src/tasks/task.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [PrismaModule, AuthModule, TaskModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
