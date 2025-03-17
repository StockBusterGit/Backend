import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  // ✅ Relation ManyToMany avec `Products`
  @ManyToMany(() => Product, (product) => product.tags)
  products: Product[];
}
