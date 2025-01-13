import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RolesService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  // Hook qui s'exécute au démarrage de l'application
  async onApplicationBootstrap() {
    await this.seedRoles();
  }

  // Ajouter les rôles admin et user s'ils n'existent pas
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
