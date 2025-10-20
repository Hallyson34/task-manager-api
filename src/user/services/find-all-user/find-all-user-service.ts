import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { UserDto } from '../../dto/user.dto';
import { UserRepository } from '../../user.repository';

@Injectable()
export class FindAllUserService {
  private readonly logger = new Logger(FindAllUserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async execute(): Promise<UserDto[]> {
    try {
      return await this.userRepository.findAll();
    } catch (error) {
      this.logger.error('Erro ao buscar usuarios:', error);

      throw new InternalServerErrorException(
        'Ocorreu um erro ao tentar buscar os usuários no banco de dados.',
      );
    }
  }
}
