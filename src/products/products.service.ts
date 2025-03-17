import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { Company } from '../companies/entities/company.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Status } from '../status/entities/status.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductStatus } from './enums/product-status.enum';
import { ApiTags } from '@nestjs/swagger';

@Injectable()
@ApiTags('Products')
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,

    @InjectRepository(Tag)
    private readonly tagRepo: Repository<Tag>,

    @InjectRepository(Status)
    private readonly statusRepo: Repository<Status>,
  ) {}

  /**
   * Récupérer tous les produits avec leurs relations.
   */
  async findAll(): Promise<Product[]> {
    return this.productRepo.find({
      relations: ['company', 'tags', 'statusEntity'],
    });
  }

  /**
   * Récupérer un produit par ID.
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['company', 'tags', 'statusEntity'],
    });
    if (!product) {
      throw new NotFoundException(`Produit #${id} non trouvé`);
    }
    return product;
  }

  /**
   * Créer un produit avec tags, status et company.
   */
  async create(dto: CreateProductDto): Promise<Product> {
    const { tags, companyId, statusId, ...productData } = dto;

    const company = await this.companyRepo.findOne({
      where: { id: companyId },
    });
    if (!company) {
      throw new NotFoundException(`Société avec ID ${companyId} non trouvée`);
    }

    let status = null;
    if (statusId) {
      status = await this.statusRepo.findOne({ where: { id: statusId } });
      if (!status) {
        throw new NotFoundException(`Statut avec ID ${statusId} non trouvé`);
      }
    }

    const product = this.productRepo.create({
      ...productData,
      company,
      statusEntity: status,
    });

    if (tags && tags.length > 0) {
      const foundTags = await this.tagRepo.findBy({ id: In(tags) });
      if (foundTags.length !== tags.length) {
        throw new NotFoundException('Un ou plusieurs tags sont introuvables.');
      }
      product.tags = foundTags;
    }

    return this.productRepo.save(product);
  }

  /**
   * Mettre à jour un produit avec les nouvelles informations.
   */
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    if (dto.label !== undefined) product.label = dto.label;
    if (dto.quantity !== undefined) product.quantity = dto.quantity;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.stock_min !== undefined) product.stock_min = dto.stock_min;
    if (dto.price_unit !== undefined) product.price_unit = dto.price_unit;

    if (dto.companyId !== undefined) {
      const company = await this.companyRepo.findOne({
        where: { id: dto.companyId },
      });
      if (!company) {
        throw new NotFoundException(
          `Société avec ID ${dto.companyId} non trouvée`,
        );
      }
      product.company = company;
    }

    if (dto.statusId !== undefined) {
      const status = await this.statusRepo.findOne({
        where: { id: dto.statusId },
      });
      if (!status) {
        throw new NotFoundException(
          `Statut avec ID ${dto.statusId} non trouvé`,
        );
      }
      product.statusEntity = status;
    }

    if (dto.tags !== undefined) {
      const foundTags = await this.tagRepo.findBy({ id: In(dto.tags) });
      if (foundTags.length !== dto.tags.length) {
        throw new NotFoundException('Un ou plusieurs tags sont introuvables.');
      }
      product.tags = foundTags;
    }

    return this.productRepo.save(product);
  }

  /**
   * Supprimer un produit.
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }

  /**
   * Mettre à jour le stock d'un produit et ajuster son statut en fonction du stock restant.
   */
  async updateStock(productId: number, quantitySold: number): Promise<Product> {
    const product = await this.findOne(productId);

    if (quantitySold < 0) {
      throw new BadRequestException(
        'La quantité vendue ne peut pas être négative.',
      );
    }

    product.stock = Math.max(0, product.stock - quantitySold);
    product.status = this.determineStatus(product.stock, product.stock_min);

    console.log(
      `🛠️ Mise à jour stock produit #${product.id}: Nouveau stock: ${product.stock}, Nouveau statut: ${product.status}`,
    );

    return this.productRepo.save(product);
  }

  /**
   * Déterminer le statut du produit en fonction du stock.
   */
  private determineStatus(stock: number, stockMin: number): ProductStatus {
    if (stock <= 0) {
      return ProductStatus.OUT_OF_STOCK;
    } else if (stock <= stockMin) {
      return ProductStatus.LOW_QUANTITY;
    } else if (stock < stockMin * 2) {
      return ProductStatus.ON_ORDER;
    }
    return ProductStatus.ACTIVE;
  }
}
