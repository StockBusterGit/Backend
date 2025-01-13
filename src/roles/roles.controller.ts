import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';

@Controller('roles')
@ApiTags('Roles') // Ajout du tag Swagger "Roles"
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all roles' })
  @ApiResponse({
    status: 200,
    description: 'List of all roles',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'number', example: 1 },
          name: { type: 'string', example: 'admin' },
        },
      },
    },
  })
  findAll() {
    return this.rolesService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a new role' })
  @ApiBody({
    description: 'Data for the new role',
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'admin' },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'The role has been successfully created.',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        name: { type: 'string', example: 'admin' },
      },
    },
  })
  create(@Body() body: { name: string }) {
    return this.rolesService.create(body);
  }
}
