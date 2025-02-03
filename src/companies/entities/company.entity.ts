import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity('app_companies')
export class Company {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1, description: 'Unique ID of the company' })
  id: number;

  @Column()
  @ApiProperty({ example: 'Potato corp', description: 'Name of the company' })
  name: string;

  // Relation ManyToOne : une company est liée à un user
  @ManyToOne(() => User, (user) => user.companies, {
    onDelete: 'CASCADE', // si besoin de supprimer les companies si user supprimé
    nullable: false,
  })
  @ApiProperty({
    description: 'User that owns this company',
    type: () => User,
  })
  owner: User;
  products: any;
}
