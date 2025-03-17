import { IsString, IsNotEmpty } from 'class-validator';

export class CreateStatusDto {
  @IsString()
  @IsNotEmpty()
  label: string;
}
