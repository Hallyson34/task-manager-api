import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  @IsString({ message: 'O nome é obrigatório.' })
  name: string;

  @ApiProperty()
  @IsEmail({}, { message: 'O email deve ser válido.' })
  email: string;

  @ApiProperty()
  @IsString({ message: 'A senha é obrigatória.' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  password: string;
}
