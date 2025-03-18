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
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';
@ApiTags('Status')
@ApiBearerAuth()
@Controller('status')
@UseGuards(JwtAuthGuard, RolesGuard)
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @Get()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Lister les statuts accessibles' })
  @ApiResponse({
    status: 200,
    description: 'Liste des statuts récupérée avec succès',
  })
  findAll(@Req() req) {
    return this.statusService.findAllByUser(req.user);
  }

  @Get(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  @ApiOperation({ summary: 'Obtenir un statut par ID' })
  @ApiResponse({ status: 200, description: 'Statut récupéré avec succès' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.statusService.findOneByUser(id, req.user);
  }

  @Post()
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Créer un statut' })
  @ApiBody({ type: CreateStatusDto })
  @ApiResponse({ status: 201, description: 'Statut créé avec succès' })
  create(@Body() createStatusDto: CreateStatusDto, @Req() req) {
    return this.statusService.create(createStatusDto, req.user);
  }

  @Patch(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Modifier un statut' })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({ status: 200, description: 'Statut modifié avec succès' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStatusDto: UpdateStatusDto,
    @Req() req,
  ) {
    return this.statusService.update(id, updateStatusDto, req.user);
  }

  @Delete(':id')
  @Roles(Role.SUPER_ADMIN, Role.ADMIN)
  @ApiOperation({ summary: 'Supprimer un statut' })
  @ApiResponse({ status: 200, description: 'Statut supprimé avec succès' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.statusService.remove(id, req.user);
  }
}
