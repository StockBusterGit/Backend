import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, ...userData } = createUserDto;

    // Vérifier si le rôle existe
    const roleEntity = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (!roleEntity) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    // Créer et sauvegarder l'utilisateur
    const user = this.userRepository.create({
      ...userData,
      role: roleEntity,
    });
    return this.userRepository.save(user);
  }
}
