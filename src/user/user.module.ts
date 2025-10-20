import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/config/prisma/prisma.module';
import { FindAllUserService } from './services/find-all-user/find-all-user-service';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [UserController],
  providers: [UserRepository, FindAllUserService],
})
export class UserModule {}
