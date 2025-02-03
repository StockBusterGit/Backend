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

  /**
   * Retrieves all users with their associated roles.
   *
   * @returns {Promise<User[]>} - A promise that resolves to an array of all users, including their roles.
   */

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  /**
   * Finds a user by their email address.
   *
   * @param {string} email - The email address to search for.
   * @returns {Promise<User | undefined>} - A promise that resolves to the user with the specified email, or undefined if no matching user is found.
   */

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  /**
   * Creates a new user with the given data.
   *
   * @param {CreateUserDto} createUserDto - Data Transfer Object containing the user's details including username, password, email, and roleId.
   * @returns {Promise<User>} - A promise that resolves to the created User entity.
   * @throws {NotFoundException} - If the specified roleId does not correspond to an existing role.
   */

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { roleId, ...userData } = createUserDto;

    const roleEntity = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (!roleEntity) {
      throw new NotFoundException(`Role with ID ${roleId} not found`);
    }

    const user = this.userRepository.create({
      ...userData,
      role: roleEntity,
    });
    return this.userRepository.save(user);
  }
}
