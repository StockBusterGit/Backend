import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Company } from '../companies/entities/company.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {}

  /**
   * Create a new product.
   */
  async create(dto: CreateProductDto): Promise<Product> {
    // Vérifier si la company existe
    const company = await this.companyRepo.findOne({
      where: { id: dto.companyId },
    });
    if (!company) {
      throw new NotFoundException(`Company with ID ${dto.companyId} not found`);
    }

    // Créer le produit
    const product = this.productRepo.create({
      reference: dto.reference,
      label: dto.label,
      description: dto.description,
      stock: dto.stock ?? 0,
      stockMin: dto.stockMin ?? 0,
      unitPrice: dto.unitPrice ?? 0,
      status: dto.status ?? 'Disponible',
      format: dto.format ?? null,
      company: company,
    });

    return this.productRepo.save(product);
  }

  /**
   * Find all products, with their company.
   */
  async findAll(): Promise<Product[]> {
    return this.productRepo.find({ relations: ['company'] });
  }

  /**
   * Find one product by ID.
   */
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['company'],
    });
    if (!product) {
      throw new NotFoundException(`Product #${id} not found`);
    }
    return product;
  }

  /**
   * Update a product.
   */
  async update(id: number, dto: UpdateProductDto): Promise<Product> {
    const product = await this.findOne(id);

    // Si on veut changer la company
    if (dto.companyId) {
      const company = await this.companyRepo.findOne({
        where: { id: dto.companyId },
      });
      if (!company) {
        throw new NotFoundException(
          `Company with ID ${dto.companyId} not found`,
        );
      }
      product.company = company;
    }

    // Mettre à jour les autres champs
    if (dto.reference !== undefined) product.reference = dto.reference;
    if (dto.label !== undefined) product.label = dto.label;
    if (dto.description !== undefined) product.description = dto.description;
    if (dto.stock !== undefined) product.stock = dto.stock;
    if (dto.stockMin !== undefined) product.stockMin = dto.stockMin;
    if (dto.unitPrice !== undefined) product.unitPrice = dto.unitPrice;
    if (dto.status !== undefined) product.status = dto.status;
    if (dto.format !== undefined) product.format = dto.format;

    return this.productRepo.save(product);
  }

  /**
   * Remove a product by ID.
   */
  async remove(id: number): Promise<void> {
    const product = await this.findOne(id);
    await this.productRepo.remove(product);
  }
}
