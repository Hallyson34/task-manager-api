import { TaskDto } from 'src/tasks/dto/task.dto';
import { RolesDto } from './roles.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [TaskDto] })
  tasks?: TaskDto[];

  @ApiProperty({ type: [RolesDto] })
  roles?: RolesDto[];
}
