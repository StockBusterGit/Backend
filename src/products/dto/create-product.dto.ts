import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsDecimal,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: '#3011', description: 'Reference of the product' })
  @IsString()
  @IsNotEmpty()
  reference: string;

  @ApiProperty({
    example: 'Bidon 5L',
    description: 'Label / name of the product',
  })
  @IsString()
  @IsNotEmpty()
  label: string;

  @ApiProperty({
    example: 'Ceci est un produit très pratique ...',
    description: 'Description of the product',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 120, description: 'Current stock' })
  @IsNumber()
  @IsOptional()
  stock?: number;

  @ApiProperty({ example: 20, description: 'Minimum stock' })
  @IsNumber()
  @IsOptional()
  stockMin?: number;

  @ApiProperty({ example: 9.04, description: 'Unit price' })
  @IsDecimal()
  @IsOptional()
  unitPrice?: number;

  @ApiProperty({
    example: 'Disponible',
    description: 'Status (e.g. Disponible, En commande, Hors stock, ...)',
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    example: 'Bidon en Litres',
    description: 'Format of the product (unit, container, etc.)',
    required: false,
  })
  @IsString()
  @IsOptional()
  format?: string;

  @ApiProperty({ example: 1, description: 'ID of the company' })
  @IsNotEmpty()
  companyId: number;
}
