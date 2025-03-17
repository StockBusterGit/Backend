import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { NotFoundException } from '@nestjs/common';
import { Tag } from './entities/tag.entity';
import { Product } from '../products/entities/product.entity';
import { ProductStatus } from '../products/enums/product-status.enum';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  // Créer un mock complet d'un produit
  const mockProduct1: Partial<Product> = {
    id: 1,
    label: 'Product 1',
    quantity: 10,
    stock: 100,
    stock_min: 20,
    price_unit: 29.99,
    status: ProductStatus.ACTIVE,
  };

  const mockProduct2: Partial<Product> = {
    id: 2,
    label: 'Product 2',
    quantity: 5,
    stock: 50,
    stock_min: 10,
    price_unit: 19.99,
    status: ProductStatus.ACTIVE,
  };

  const mockTag: Partial<Tag> = {
    id: 1,
    label: 'Périssable',
    products: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockTag]),
            findOne: jest.fn().mockResolvedValue(mockTag),
            create: jest.fn().mockResolvedValue(mockTag),
            update: jest.fn().mockResolvedValue({
              ...mockTag,
              label: 'Non périssable',
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const result = await controller.findAll();
      
      expect(result).toEqual([mockTag]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single tag', async () => {
      const result = await controller.findOne(1);
      
      expect(result).toEqual(mockTag);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tag not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(
        new NotFoundException('Tag #999 non trouvé.')
      );
      
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a tag', async () => {
      const createTagDto: CreateTagDto = {
        label: 'Périssable',
        productIds: []
      };
      
      const result = await controller.create(createTagDto);
      
      expect(result).toEqual(mockTag);
      expect(service.create).toHaveBeenCalledWith(createTagDto);
    });

    it('should create a tag with product associations', async () => {
      const createTagDto: CreateTagDto = {
        label: 'Périssable',
        productIds: [1, 2]
      };
      
      const mockTagWithProducts: Partial<Tag> = {
        ...mockTag,
        products: [mockProduct1, mockProduct2] as Product[]
      };
      
      jest.spyOn(service, 'create').mockResolvedValueOnce(mockTagWithProducts as Tag);
      
      const result = await controller.create(createTagDto);
      
      expect(result).toEqual(mockTagWithProducts);
      expect(service.create).toHaveBeenCalledWith(createTagDto);
    });

    it('should throw NotFoundException if tag already exists', async () => {
      const createTagDto: CreateTagDto = {
        label: 'Périssable',
        productIds: []
      };
      
      jest.spyOn(service, 'create').mockRejectedValueOnce(
        new NotFoundException('Le tag "Périssable" existe déjà.')
      );
      
      await expect(controller.create(createTagDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a tag', async () => {
      const updateTagDto: UpdateTagDto = {
        label: 'Non périssable',
      };
      
      const result = await controller.update(1, updateTagDto);
      
      expect(result).toEqual({
        ...mockTag,
        label: 'Non périssable',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateTagDto);
    });

    it('should update product associations', async () => {
      const updateTagDto: UpdateTagDto = {
        productIds: [1, 2]
      };
      
      const mockTagWithUpdatedProducts: Partial<Tag> = {
        ...mockTag,
        products: [mockProduct1, mockProduct2] as Product[]
      };
      
      jest.spyOn(service, 'update').mockResolvedValueOnce(mockTagWithUpdatedProducts as Tag);
      
      const result = await controller.update(1, updateTagDto);
      
      expect(result).toEqual(mockTagWithUpdatedProducts);
      expect(service.update).toHaveBeenCalledWith(1, updateTagDto);
    });

    it('should throw NotFoundException if tag to update not found', async () => {
      const updateTagDto: UpdateTagDto = {
        label: 'Non périssable',
      };
      
      jest.spyOn(service, 'update').mockRejectedValueOnce(
        new NotFoundException('Tag #999 non trouvé.')
      );
      
      await expect(controller.update(999, updateTagDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a tag', async () => {
      const result = await controller.remove(1);
      
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if tag to remove not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(
        new NotFoundException('Tag #999 non trouvé.')
      );
      
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});