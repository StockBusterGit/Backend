import { PartialType, ApiPropertyOptional } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @ApiPropertyOptional({
    example: 'Chaise en métal',
    description: 'Nouveau nom du produit',
  })
  label?: string;

  @ApiPropertyOptional({
    example: 80,
    description: 'Nouvelle quantité en stock',
  })
  stock?: number;

  @ApiPropertyOptional({
    example: 39.99,
    description: 'Nouveau prix unitaire du produit (€)',
  })
  price_unit?: number;
}
