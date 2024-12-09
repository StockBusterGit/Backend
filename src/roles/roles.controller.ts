import { Controller, Get, Post, Body } from '@nestjs/common';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';

@Controller('roles') // Route de base pour `/roles`
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get() // Endpoint pour GET `/roles`
  findAll() {
    return this.rolesService.findAll();
  }

  @Post() // Endpoint pour POST `/roles`
  create(@Body() roleData: Partial<Role>) {
    return this.rolesService.create(roleData);
  }
}
