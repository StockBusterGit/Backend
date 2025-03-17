import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/companies/entities/company.entity';

@Entity('app_products')
export class Product {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique ID of the product' })
  id: number;

  @Column()
  @ApiProperty({ example: '#3011', description: 'Reference of the product' })
  reference: string;

  @Column()
  @ApiProperty({
    example: 'Gros bidon de 5L',
    description: 'Label / name of the product',
  })
  label: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Produit idéal pour ...',
    description: 'Short description',
  })
  description?: string;

  @Column({ default: 0 })
  @ApiProperty({ example: 120, description: 'Current stock' })
  stock: number;

  @Column({ default: 0 })
  @ApiProperty({ example: 20, description: 'Minimum stock / threshold' })
  stockMin: number;

  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  @ApiProperty({ example: 9.04, description: 'Unit price' })
  unitPrice: number;

  @Column({ default: 'Disponible' })
  @ApiProperty({
    example: 'En commande',
    description: 'Status (e.g. Disponible, En commande, Hors stock, ...)',
  })
  status: string;

  @Column({ nullable: true })
  @ApiProperty({
    example: 'Bidon en Litres',
    description: 'Format of the product',
  })
  format?: string;

  // Relation ManyToOne -> Company
  @ManyToOne(() => Company, (company) => company.products, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @ApiProperty({
    description: 'The company this product belongs to',
    type: () => Company,
  })
  company: Company;
}
