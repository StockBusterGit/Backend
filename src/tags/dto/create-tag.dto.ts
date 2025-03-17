import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateTagDto {
  @ApiProperty({ example: 'Fragile', description: 'Nom du tag' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    example: [1, 2],
    description: 'Liste des identifiants produits associés (optionnel)',
    required: false,
  })
  @IsOptional()
  @IsArray()
  productIds?: number[];
}
