import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Produit X' })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({ example: 100 })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 50 })
  @IsNumber()
  stock: number;

  @ApiProperty({ example: 20 })
  @IsNumber()
  stock_min: number;

  @ApiProperty({ example: 99.99 })
  @IsNumber()
  price_unit: number;

  @ApiProperty({ example: 1, description: 'ID de la compagnie' })
  @IsNumber()
  companyId: number;

  @ApiProperty({ example: 1, description: 'ID du statut' })
  @IsOptional()
  @IsNumber()
  statusId?: number;

  @ApiProperty({ example: [1, 2], description: 'Liste des ID des tags' })
  @IsOptional()
  @IsArray()
  tags?: number[];
}
