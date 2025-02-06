import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('status')
export class Status {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  // ✅ Ajout de la relation avec `Products`
  @OneToMany(() => Product, (product) => product.statusEntity)
  products: Product[];
}
