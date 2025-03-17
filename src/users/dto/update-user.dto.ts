import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiPropertyOptional({ example: 'new_username' })
  username?: string;

  @ApiPropertyOptional({ example: 'newemail@example.com' })
  email?: string;

  @ApiPropertyOptional({ example: 'NewSecurePass123!' })
  password?: string;

  @ApiPropertyOptional({ example: 2 })
  roleId?: number;
}
