// status.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Status } from './entities/status.entity';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class StatusService {
  constructor(
    @InjectRepository(Status) private readonly statusRepo: Repository<Status>,
  ) {}

  async findAllByUser(user: User): Promise<Status[]> {
    if (user.role.name === Role.SUPER_ADMIN) {
      return this.statusRepo.find();
    }
    return this.statusRepo
      .createQueryBuilder('status')
      .innerJoin('status.products', 'product')
      .innerJoin('product.company', 'company')
      .where('company.ownerId = :userId', { userId: user.id })
      .getMany();
  }

  async findOneByUser(id: number, user: User): Promise<Status> {
    const status = await this.statusRepo.findOne({ where: { id } });
    if (!status) throw new NotFoundException('Statut non trouvé');

    if (user.role.name === Role.SUPER_ADMIN) return status;

    const linkedToUser = await this.statusRepo
      .createQueryBuilder('status')
      .innerJoin('status.products', 'product')
      .innerJoin('product.company', 'company')
      .where('status.id = :id AND company.ownerId = :userId', {
        id,
        userId: user.id,
      })
      .getOne();

    if (!linkedToUser)
      throw new ForbiddenException('Accès interdit au statut.');
    return status;
  }

  async create(dto: CreateStatusDto, user: User): Promise<Status> {
    if (user.role.name !== Role.SUPER_ADMIN)
      throw new ForbiddenException('Seul SUPER_ADMIN peut créer des statuts.');
    const status = this.statusRepo.create(dto);
    return this.statusRepo.save(status);
  }

  async update(id: number, dto: UpdateStatusDto, user: User): Promise<Status> {
    if (user.role.name !== Role.SUPER_ADMIN)
      throw new ForbiddenException(
        'Seul SUPER_ADMIN peut modifier des statuts.',
      );
    const status = await this.findOneByUser(id, user);
    Object.assign(status, dto);
    return this.statusRepo.save(status);
  }

  async remove(id: number, user: User): Promise<void> {
    if (user.role.name !== Role.SUPER_ADMIN)
      throw new ForbiddenException(
        'Seul SUPER_ADMIN peut supprimer des statuts.',
      );
    const status = await this.findOneByUser(id, user);
    await this.statusRepo.remove(status);
  }
}
