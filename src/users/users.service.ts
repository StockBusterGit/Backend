import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  /**
   * Récupérer tous les utilisateurs avec leurs rôles associés
   */
  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  /**
   * Rechercher un utilisateur par email
   * @param email L'email de l'utilisateur
   * @returns L'utilisateur correspondant ou undefined
   */
  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'], // Inclure les relations avec les rôles
    });
  }

  /**
   * Créer un utilisateur
   * @param createUserDto Données pour créer un utilisateur
   * @returns L'utilisateur créé
   */
  async create(createUserDto: Partial<User>): Promise<User> {
    const { role, ...userData } = createUserDto;

    // Vérifier si le rôle existe
    const roleEntity = await this.roleRepository.findOne({
      where: { id: role.id },
    });
    if (!roleEntity) {
      throw new NotFoundException(`Role with ID ${role.id} not found`);
    }

    // Créer et sauvegarder l'utilisateur
    const user = this.userRepository.create({ ...userData, role: roleEntity });
    return this.userRepository.save(user);
  }
}
