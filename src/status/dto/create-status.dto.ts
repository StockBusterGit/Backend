import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @ApiProperty({ example: 'En stock', description: 'Nom du statut' })
  @IsString()
  @IsNotEmpty()
  label: string;
}
