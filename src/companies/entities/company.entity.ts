import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Product } from '../../products/entities/product.entity';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => User, (user) => user.companies, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  owner: User;

  // ✅ Ajout de la relation avec `Products`
  @OneToMany(() => Product, (product) => product.company)
  products: Product[];
}
