import { IsString, IsNotEmpty, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  roleId: number; // ID du rôle à assigner
}
