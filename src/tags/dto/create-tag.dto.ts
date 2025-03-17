import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class CreateTagDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  // Optionnel: IDs de produits à associer directement à la création
  @IsArray()
  @IsOptional()
  productIds?: number[];
}
