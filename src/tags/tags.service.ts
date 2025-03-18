// tags.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tag.entity';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { User } from '../users/entities/user.entity';
import { Role } from '../auth/enums/role.enum';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAllByUser(user: User): Promise<Tag[]> {
    if (user.role.name === Role.SUPER_ADMIN) {
      return this.tagRepository.find();
    }
    return this.tagRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.products', 'product')
      .innerJoin('product.company', 'company')
      .where('company.ownerId = :userId', { userId: user.id })
      .getMany();
  }

  async findOneByUser(id: number, user: User): Promise<Tag> {
    const tag = await this.tagRepository.findOne({ where: { id } });
    if (!tag) throw new NotFoundException('Tag non trouvé');

    if (user.role.name === Role.SUPER_ADMIN) return tag;

    const linkedToUser = await this.tagRepository
      .createQueryBuilder('tag')
      .innerJoin('tag.products', 'product')
      .innerJoin('product.company', 'company')
      .where('tag.id = :id AND company.ownerId = :userId', {
        id,
        userId: user.id,
      })
      .getOne();

    if (!linkedToUser) throw new ForbiddenException('Accès interdit au tag.');
    return tag;
  }

  async create(dto: CreateTagDto, user: User): Promise<Tag> {
    if (user.role.name !== Role.SUPER_ADMIN)
      throw new ForbiddenException('Seul SUPER_ADMIN peut créer des tags.');
    const tag = this.tagRepository.create(dto);
    return this.tagRepository.save(tag);
  }

  async update(id: number, dto: UpdateTagDto, user: User): Promise<Tag> {
    if (user.role.name !== Role.SUPER_ADMIN)
      throw new ForbiddenException('Seul SUPER_ADMIN peut modifier des tags.');
    const tag = await this.findOneByUser(id, user);
    Object.assign(tag, dto);
    return this.tagRepository.save(tag);
  }

  async remove(id: number, user: User): Promise<void> {
    if (user.role.name !== Role.SUPER_ADMIN)
      throw new ForbiddenException('Seul SUPER_ADMIN peut supprimer des tags.');
    const tag = await this.findOneByUser(id, user);
    await this.tagRepository.remove(tag);
  }
}
