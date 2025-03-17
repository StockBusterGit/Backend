import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateCompanyDto {
  @ApiProperty({ example: 'IKEA', description: 'Nom de la société' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 1, description: "ID de l'utilisateur propriétaire" })
  @IsNumber()
  userId: number;
}
