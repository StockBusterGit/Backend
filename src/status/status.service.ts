import {
  Injectable,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { ProductStatus } from '../products/enums/product-status.enum';

@Injectable()
export class StatusService implements OnApplicationBootstrap {
  constructor(
    @InjectRepository(Status)
    private readonly statusRepo: Repository<Status>,
  ) {}

  /**
   * 🔄 Exécuté au démarrage pour insérer les statuts prédéfinis s'ils n'existent pas.
   */
  async onApplicationBootstrap() {
    await this.seedStatuses();
  }

  /**
   * Insère les statuts prédéfinis s'ils ne sont pas encore enregistrés.
   */
  private async seedStatuses() {
    const predefinedStatuses = [
      { key: ProductStatus.ACTIVE, label: 'Actif' },
      { key: ProductStatus.INACTIVE, label: 'Inactif' },
      { key: ProductStatus.OUT_OF_STOCK, label: 'Rupture de stock' },
      { key: ProductStatus.ON_ORDER, label: 'En commande' },
      { key: ProductStatus.LOW_QUANTITY, label: 'Bientôt en rupture' },
      { key: ProductStatus.DISCONTINUED, label: 'Arrêté' },
      { key: ProductStatus.PROMOTION, label: 'En promotion' },
    ];

    for (const { label } of predefinedStatuses) {
      const existingStatus = await this.statusRepo.findOne({
        where: { label },
      });
      if (!existingStatus) {
        const status = this.statusRepo.create({ label });
        await this.statusRepo.save(status);
        console.log(`✅ Statut "${label}" ajouté.`);
      }
    }
  }

  /**
   * Récupère tous les statuts.
   */
  async findAll(): Promise<Status[]> {
    return this.statusRepo.find();
  }

  /**
   * Récupère un statut par ID.
   */
  async findOne(id: number): Promise<Status> {
    const status = await this.statusRepo.findOne({ where: { id } });
    if (!status) {
      throw new NotFoundException(`Statut #${id} non trouvé`);
    }
    return status;
  }

  /**
   * Crée un nouveau statut.
   */
  async create(dto: CreateStatusDto): Promise<Status> {
    const existingStatus = await this.statusRepo.findOne({
      where: { label: dto.label },
    });
    if (existingStatus) {
      throw new NotFoundException(`Le statut "${dto.label}" existe déjà.`);
    }

    const status = this.statusRepo.create({ label: dto.label });
    return this.statusRepo.save(status);
  }

  /**
   * Met à jour un statut existant.
   */
  async update(id: number, dto: UpdateStatusDto): Promise<Status> {
    const status = await this.findOne(id);
    if (dto.label !== undefined) {
      status.label = dto.label;
    }
    return this.statusRepo.save(status);
  }

  /**
   * Supprime un statut par ID.
   */
  async remove(id: number): Promise<void> {
    const status = await this.findOne(id);
    await this.statusRepo.remove(status);
  }
}
