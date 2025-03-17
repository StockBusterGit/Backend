import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Product } from '../../src/products/entities/product.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async findAll(): Promise<Tag[]> {
    // relations: ['products'] si tu veux voir directement la liste des produits
    return this.tagRepository.find({ relations: ['products'] });
  }

  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag #${id} not found`);
    }
    return tag;
  }

  async create(dto: CreateTagDto): Promise<Tag> {
    // On récupère les produits, si productIds est fourni
    let products: Product[] = [];
    if (dto.productIds && dto.productIds.length > 0) {
      products = await this.productRepository.find({
        where: { id: In(dto.productIds) },
      });
    }

    const tag = this.tagRepository.create({
      label: dto.label,
      products,
    });
    return this.tagRepository.save(tag);
  }

  async update(id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (dto.label !== undefined) {
      tag.label = dto.label;
    }

    // Si on reçoit une liste de productIds, on remplace la liste
    if (dto.productIds) {
      const products = await this.productRepository.find({
        where: { id: In(dto.productIds) },
      });
      tag.products = products;
    }

    return this.tagRepository.save(tag);
  }

  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
