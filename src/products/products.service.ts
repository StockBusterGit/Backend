import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Product } from './entities/product.entity';
import { Company } from '../companies/entities/company.entity';
import { Tag } from '../tags/entities/tag.entity';
import { Status } from '../status/entities/status.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { Role } from '../roles/entities/role.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
@ApiTags('Products')
export class ProductService {
  constructor(
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Company) private companyRepo: Repository<Company>,
    @InjectRepository(Tag) private tagRepo: Repository<Tag>,
    @InjectRepository(Status) private statusRepo: Repository<Status>,
  ) {}

  async findAllByUser(user: User): Promise<Product[]> {
    if (user.role.name === Role.SUPER_ADMIN) {
      return this.productRepo.find({
        relations: ['company', 'tags', 'statusEntity'],
      });
    }
    return this.productRepo.find({
      where: { company: { owner: { id: user.id } } },
      relations: ['company', 'tags', 'statusEntity'],
    });
  }

  async findOneByUser(id: number, user: User): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['company', 'company.owner', 'tags', 'statusEntity'],
    });

    if (!product) throw new NotFoundException('Produit non trouvé.');

    if (
      user.role.name !== Role.SUPER_ADMIN &&
      product.company.owner.id !== user.id
    ) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'accéder à ce produit.",
      );
    }

    return product;
  }

  async create(dto: CreateProductDto, user: User): Promise<Product> {
    const { tags, statusId, ...productData } = dto;

    const company = await this.companyRepo.findOne({
      where: { id: dto.companyId },
      relations: ['owner'],
    });
    if (!company) throw new NotFoundException('Compagnie non trouvée.');

    if (user.role.name !== Role.SUPER_ADMIN && company.owner.id !== user.id) {
      throw new ForbiddenException(
        "Vous n'avez pas le droit d'ajouter un produit à cette société.",
      );
    }

    const product = this.productRepo.create({
      ...productData,
      company,
    });

    if (statusId) {
      const status = await this.statusRepo.findOne({ where: { id: statusId } });
      if (!status)
        throw new NotFoundException(`Statut avec ID ${statusId} non trouvé`);
      product.statusEntity = status;
    }

    if (tags?.length) {
      const foundTags = await this.tagRepo.find({ where: { id: In(tags) } });
      if (foundTags.length !== tags.length)
        throw new NotFoundException('Un ou plusieurs tags non trouvés.');
      product.tags = foundTags;
    }

    return this.productRepo.save(product);
  }

  async update(
    id: number,
    dto: UpdateProductDto,
    user: User,
  ): Promise<Product> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['company', 'company.owner'],
    });
    if (!product) throw new NotFoundException('Produit non trouvé.');

    if (
      user.role.name !== Role.SUPER_ADMIN &&
      product.company.owner.id !== user.id
    )
      throw new ForbiddenException(
        "Vous n'avez pas le droit de modifier ce produit.",
      );

    Object.assign(product, dto);
    return this.productRepo.save(product);
  }

  async remove(id: number, user: User): Promise<void> {
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ['company', 'company.owner'],
    });
    if (!product) throw new NotFoundException('Produit non trouvé.');

    if (
      user.role.name !== Role.SUPER_ADMIN &&
      product.company.owner.id !== user.id
    )
      throw new ForbiddenException(
        "Vous n'avez pas le droit de supprimer ce produit.",
      );

    await this.productRepo.remove(product);
  }
}
