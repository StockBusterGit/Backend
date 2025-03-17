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
} from '@nestjs/swagger';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../auth/enums/role.enum';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Récupérer tous les produits accessibles à l’utilisateur connecté',
  })
  @ApiResponse({ status: 200, description: 'Liste des produits récupérée' })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findAll(@Req() req) {
    return this.productsService.findAllByUser(req.user);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un produit par ID' })
  @ApiResponse({ status: 200, description: 'Produit trouvé' })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.productsService.findOneByUser(id, req.user);
  }

  @Post()
  @ApiOperation({ summary: 'Créer un produit' })
  @ApiResponse({ status: 201, description: 'Produit créé avec succès' })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async create(@Body() createProductDto: CreateProductDto, @Req() req) {
    return this.productsService.create(createProductDto, req.user);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un produit existant par ID' })
  @ApiResponse({ status: 200, description: 'Produit modifié avec succès' })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req,
  ) {
    return this.productsService.update(id, updateProductDto, req.user);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un produit existant' })
  @ApiResponse({ status: 200, description: 'Produit supprimé avec succès' })
  @Roles(Role.SUPER_ADMIN, Role.ADMIN, Role.USER)
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req) {
    return this.productsService.remove(id, req.user);
  }
}
