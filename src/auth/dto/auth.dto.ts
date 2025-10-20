import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';

export class AuthUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  roles: RoleType[];
}

export class AuthDto {
  @ApiProperty()
  accessToken: string;

  @ApiProperty({ type: AuthUserDto })
  user: AuthUserDto;
}
