import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findOne(id: number, user?: User): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!foundUser) throw new NotFoundException('Utilisateur non trouvé.');

    if (user) {
      if (user.role.name === 'USER' && user.id !== foundUser.id) {
        throw new ForbiddenException('Accès refusé à cet utilisateur.');
      }

      if (user.role.name === 'ADMIN' && foundUser.role.name === 'SUPER_ADMIN') {
        throw new ForbiddenException(
          'Vous ne pouvez pas accéder à cet utilisateur.',
        );
      }
    }

    return foundUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const role = await this.roleRepository.findOne({
      where: { id: dto.roleId },
    });
    if (!role) throw new NotFoundException('Rôle non trouvé.');
    const user = this.userRepository.create({ ...dto, role });
    return this.userRepository.save(user);
  }

  async update(id: number, dto: UpdateUserDto, user: User): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!existingUser) throw new NotFoundException('Utilisateur non trouvé.');

    if (user.role.name === 'USER' && user.id !== existingUser.id) {
      throw new ForbiddenException(
        'Vous ne pouvez modifier que votre propre profil.',
      );
    }

    if (dto.roleId) {
      const role = await this.roleRepository.findOne({
        where: { id: dto.roleId },
      });
      if (!role) throw new NotFoundException('Rôle non trouvé.');
      existingUser.role = role;
    }

    Object.assign(existingUser, dto);
    return this.userRepository.save(existingUser);
  }

  async remove(id: number): Promise<void> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) throw new NotFoundException('Utilisateur non trouvé.');
    await this.userRepository.remove(existingUser);
  }
}
