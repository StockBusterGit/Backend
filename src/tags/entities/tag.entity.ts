import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Product } from '../../products/entities/product.entity';

@Entity('tags')
export class Tag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  // Relation ManyToMany avec Product
  @ManyToMany(() => Product, (product) => product.tags)
  @JoinTable({
    // Table pivot
    name: 'product_tag',
    joinColumn: { name: 'id_tag', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'id_product', referencedColumnName: 'id' },
  })
  products: Product[];
}
