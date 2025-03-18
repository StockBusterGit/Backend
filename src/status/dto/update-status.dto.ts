import { PartialType, ApiProperty } from '@nestjs/swagger';
import { CreateStatusDto } from './create-status.dto';

export class UpdateStatusDto extends PartialType(CreateStatusDto) {
  @ApiProperty({
    example: 'Hors Stock',
    description: 'Nom actualisé du statut',
    required: false,
  })
  label?: string;
}
