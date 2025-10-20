import { ApiProperty } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';

export class RolesDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: RoleType;
}
