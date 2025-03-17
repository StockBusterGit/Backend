import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'Chaise en bois', description: 'Nom du produit' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 120, description: 'Quantité initiale en stock' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 100, description: 'Quantité actuelle en stock' })
  @IsNumber()
  stock: number;

  @ApiProperty({
    example: 10,
    description: 'Stock minimal avant réapprovisionnement',
  })
  @IsNumber()
  stock_min: number;

  @ApiProperty({ example: 49.99, description: 'Prix unitaire du produit (€)' })
  @IsNumber()
  price_unit: number;

  @ApiProperty({
    example: 1,
    description: 'Identifiant de la société à laquelle appartient ce produit',
  })
  @IsNumber()
  companyId: number;

  @ApiProperty({
    example: 3,
    description: 'Identifiant du statut du produit',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @ApiProperty({
    example: [1, 4, 7],
    description: 'Liste des identifiants de tags associés au produit',
    required: false,
  })
  @IsOptional()
  @IsArray()
  tags?: number[];
}
