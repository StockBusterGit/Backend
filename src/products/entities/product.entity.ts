import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  ManyToMany,
} from 'typeorm';
import { Company } from '../../companies/entities/company.entity';
import { Status } from '../../status/entities/status.entity';
import { Tag } from '../../tags/entities/tag.entity';

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

  @Column('float')
  price_unit: number;

  @Column()
  stock_min: number;

  @ManyToOne(() => Status, (status) => status.products)
  status: Status;

  @ManyToOne(() => Company, (company) => company.products)
  company: Company;

  // Relation ManyToMany inverse
  @ManyToMany(() => Tag, (tag) => tag.products)
  tags: Tag[];
}
