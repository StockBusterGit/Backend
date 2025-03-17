import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Role } from '../../roles/entities/role.entity';
import { Company } from '../../companies/entities/company.entity';

@Entity('app_users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ unique: true })
  email: string;

  // Relation avec la table "roles"
  @ManyToOne(() => Role, (role) => role.users, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  role: Role;

  // ---- NOUVEAU : Relation inverse avec la table "companies" ----
  @OneToMany(() => Company, (company) => company.owner)
  companies: Company[];
}
