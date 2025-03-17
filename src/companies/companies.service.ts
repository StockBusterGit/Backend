import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from './entities/company.entity';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  /**
   * Créer une nouvelle compagnie
   */
  async create(dto: CreateCompanyDto): Promise<Company> {
    // Vérifier si le user existe
    const user = await this.userRepo.findOne({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User with ID ${dto.userId} not found`);
    }

    const company = this.companyRepo.create({
      name: dto.name,
      owner: user,
    });
    return this.companyRepo.save(company);
  }

  /**
   * Récupérer toutes les companies
   */
  async findAll(): Promise<Company[]> {
    return this.companyRepo.find({ relations: ['owner'] });
  }

  /**
   * Récupérer une company par ID
   */
  async findOne(id: number): Promise<Company> {
    const company = await this.companyRepo.findOne({
      where: { id },
      relations: ['owner'],
    });
    if (!company) {
      throw new NotFoundException(`Company #${id} not found`);
    }
    return company;
  }

  /**
   * Mettre à jour une company
   */
  async update(id: number, dto: UpdateCompanyDto): Promise<Company> {
    const company = await this.findOne(id);

    // Mise à jour du nom
    if (dto.name !== undefined) {
      company.name = dto.name;
    }

    // Changer le owner si userId est fourni
    if (dto.userId !== undefined) {
      const user = await this.userRepo.findOne({ where: { id: dto.userId } });
      if (!user) {
        throw new NotFoundException(`User with ID ${dto.userId} not found`);
      }
      company.owner = user;
    }

    return this.companyRepo.save(company);
  }

  /**
   * Supprimer une company
   */
  async remove(id: number): Promise<void> {
    const company = await this.findOne(id);
    await this.companyRepo.remove(company);
  }
}
