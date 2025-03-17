import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: "Nom d'utilisateur" })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    example: 'john@example.com',
    description: "Email de l'utilisateur",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePassword123!', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 2,
    description: 'RoleId (1=SuperAdmin, 2=Admin, 3=User)',
  })
  @IsNumber()
  roleId: number;
}
