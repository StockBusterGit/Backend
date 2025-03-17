import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Tag } from '../../tags/entities/tag.entity';
import { Status } from '../../status/entities/status.entity';
import { ProductStatus } from '../enums/product-status.enum';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  label: string;

  @Column()
  quantity: number;

  @Column()
  stock: number;

  @Column({ type: 'float' })
  price_unit: number;

  @Column()
  stock_min: number;

  @Column({ type: 'enum', enum: ProductStatus, default: ProductStatus.ACTIVE })
  status: ProductStatus;

  // ✅ Relation avec `Company`
  @ManyToOne(() => Company, (company) => company.products, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  company: Company;

  // ✅ Relation avec `Status`
  @ManyToOne(() => Status, (status) => status.products, { nullable: true })
  statusEntity: Status;

  // ✅ Relation Many-to-Many avec `Tags`
  @ManyToMany(() => Tag, (tag) => tag.products, { cascade: true })
  @JoinTable({
    name: 'product_tags',
    joinColumn: { name: 'product_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
