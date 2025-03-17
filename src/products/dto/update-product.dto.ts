import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

// On utilise PartialType pour rendre tous les champs optionnels
export class UpdateProductDto extends PartialType(CreateProductDto) {}
