import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) { }

  /**
   * Lifecycle hook that is called when the application has fully started.
   * It seeds the database with default roles if they do not already exist.
   */
  async onApplicationBootstrap() {
    await this.seedRoles();
  }

  /**
   * Seeds the database with default roles if they do not already exist.
   *
   * The roles that are seeded are 'admin' and 'user'. If a role with the same
   * name already exists, it is skipped.
   */
  private async seedRoles() {
    const defaultRoles = ['admin', 'user'];

    for (const roleName of defaultRoles) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: roleName },
      });
      if (!existingRole) {
        const role = this.roleRepository.create({ name: roleName });
        await this.roleRepository.save(role);
        console.log(`Role "${roleName}" added.`);
      }
    }
  }

  async findAll() {
    return this.roleRepository.find();
  }

  async create(roleData: Partial<Role>) {
    const role = this.roleRepository.create(roleData);
    return this.roleRepository.save(role);
  }
}
