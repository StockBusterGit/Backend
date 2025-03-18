import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AllowAnonymous } from '../auth/decorators/allow-anonymous.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Lister tous les utilisateurs' })
  @ApiResponse({
    status: 200,
    description: 'Utilisateurs récupérés avec succès',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Obtenir un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur récupéré avec succès' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.usersService.findOne(id, req.user);
  }

  @Post()
  @AllowAnonymous()
  @ApiOperation({ summary: 'Inscription publique avec rôle USER par défaut' })
  @ApiBody({
    schema: {
      properties: {
        username: { example: 'john_doe' },
        email: { example: 'john@example.com' },
        password: { example: 'SecurePassword123!' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
  create(@Body() createUserDto: CreateUserDto) {
    createUserDto.roleId = 3;
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Modifier un utilisateur existant' })
  @ApiResponse({ status: 200, description: 'Utilisateur modifié avec succès' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req,
  ) {
    return this.usersService.update(id, updateUserDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN)
  @ApiOperation({ summary: 'Supprimer un utilisateur' })
  @ApiResponse({ status: 200, description: 'Utilisateur supprimé avec succès' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  @Post('seed-admin')
  @AllowAnonymous()
  @ApiOperation({
    summary: 'Créer un utilisateur Admin ou SuperAdmin (seed initial)',
  })
  @ApiBody({
    schema: {
      properties: {
        username: { example: 'admin_user' },
        email: { example: 'admin@example.com' },
        password: { example: 'SecurePassword123!' },
        roleId: { example: 1, description: '1 pour SUPER_ADMIN, 2 pour ADMIN' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Admin créé avec succès' })
  createSeedAdmin(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
