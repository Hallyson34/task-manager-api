import { Controller, Get, UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { RolesEnum } from 'src/enum/roles.enum';
import { UserDto } from './dto/user.dto';
import { FindAllUserService } from './services/find-all-user/find-all-user-service';
import { FindAllUsersSwagger } from './swagger/find-all-user.swagger';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly findAllUserService: FindAllUserService) {}

  @UseGuards(RolesGuard)
  @Roles(RolesEnum.ADMIN)
  @FindAllUsersSwagger()
  @Get()
  async findAll(): Promise<UserDto[]> {
    return await this.findAllUserService.execute();
  }
}
