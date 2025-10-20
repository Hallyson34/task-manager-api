import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty()
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'A senha é obrigatória.' })
  password: string;
}
