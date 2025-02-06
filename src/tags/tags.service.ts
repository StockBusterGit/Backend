import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { Product } from '../products/entities/product.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  /**
   * 🔄 Exécuté au démarrage pour insérer les tags prédéfinis s'ils n'existent pas.
   */
  async onApplicationBootstrap() {
    await this.seedTags();
  }

  /**
   * 📌 Insère les tags prédéfinis s'ils ne sont pas déjà enregistrés.
   */
  private async seedTags() {
    const predefinedTags = [
      'Périssable',
      'Non périssable',
      'Fragile',
      'Lourd',
      'Volumineux',
      'Coûteux',
      'Bon marché',
      'Édition limitée',
      'Éco-responsable',
      'En promotion',
      'Saisonnier',
      'Nouvelle arrivée',
      'Meilleure vente',
      'Stock bas',
      'Arrêté',
      'Endommagé',
      'Retourné',
      'Commande en cours',
      'Importé',
      'Fabriqué en France',
      'Vente en gros',
      'Vente au détail',
    ];

    for (const label of predefinedTags) {
      const existingTag = await this.tagRepository.findOne({
        where: { label },
      });
      if (!existingTag) {
        const tag = this.tagRepository.create({ label });
        await this.tagRepository.save(tag);
        console.log(`✅ Tag "${label}" ajouté.`);
      }
    }
  }

  /**
   * 🔍 Récupère tous les tags avec leurs produits associés.
   */
  async findAll(): Promise<Tag[]> {
    return this.tagRepository.find({ relations: ['products'] });
  }

  /**
   * 🔍 Récupère un tag par ID.
   */
  async findOne(id: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id },
      relations: ['products'],
    });
    if (!tag) {
      throw new NotFoundException(`Tag #${id} non trouvé.`);
    }
    return tag;
  }

  /**
   * ➕ Crée un nouveau tag.
   */
  async create(dto: CreateTagDto): Promise<Tag> {
    // Vérifie si le tag existe déjà
    const existingTag = await this.tagRepository.findOne({
      where: { label: dto.label },
    });
    if (existingTag) {
      throw new NotFoundException(`Le tag "${dto.label}" existe déjà.`);
    }

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

  /**
   * 📝 Met à jour un tag existant.
   */
  async update(id: number, dto: UpdateTagDto): Promise<Tag> {
    const tag = await this.findOne(id);

    if (dto.label !== undefined) {
      tag.label = dto.label;
    }

    if (dto.productIds) {
      const products = await this.productRepository.find({
        where: { id: In(dto.productIds) },
      });
      tag.products = products;
    }

    return this.tagRepository.save(tag);
  }

  /**
   * ❌ Supprime un tag par ID.
   */
  async remove(id: number): Promise<void> {
    const tag = await this.findOne(id);
    await this.tagRepository.remove(tag);
  }
}
