import { Controller, Get, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

@Controller('users') // Route de base pour `/users`
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get() // Endpoint pour GET `/users`
  findAll() {
    return this.usersService.findAll();
  }

  @Post() // Endpoint pour POST `/users`
  create(@Body() userData: Partial<User>) {
    return this.usersService.create(userData);
  }
}
