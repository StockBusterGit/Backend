import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
@ApiTags('Users') // Ajout du tag Swagger "Users"
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users' }) // Description de la route
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          username: { type: 'string', example: 'testuser' },
          email: { type: 'string', example: 'test@example.com' },
          role: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 1 },
              name: { type: 'string', example: 'admin' },
            },
          },
        },
      },
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({
    description: 'Data for the new user',
    type: CreateUserDto,
  })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        username: { type: 'string', example: 'testuser' },
        email: { type: 'string', example: 'test@example.com' },
        role: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'admin' },
          },
        },
      },
    },
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
