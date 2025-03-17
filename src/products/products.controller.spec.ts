import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './products.controller';
import { ProductService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { ProductStatus } from './enums/product-status.enum';

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  const mockProduct = {
    id: 1,
    label: 'Test Product',
    quantity: 10,
    stock: 50,
    stock_min: 20,
    price_unit: 29.99,
    status: ProductStatus.ACTIVE,
    company: { id: 1, name: 'Test Company' },
    tags: [{ id: 1, name: 'Electronics' }],
    statusEntity: { id: 1, name: 'Active' }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockProduct]),
            findOne: jest.fn().mockResolvedValue(mockProduct),
            create: jest.fn().mockResolvedValue(mockProduct),
            update: jest.fn().mockResolvedValue({
              ...mockProduct,
              label: 'Updated Product',
            }),
            updateStock: jest.fn().mockResolvedValue({
              ...mockProduct,
              stock: 40,
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll();
      
      expect(result).toEqual([mockProduct]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await controller.findOne(1);
      
      expect(result).toEqual(mockProduct);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(
        new NotFoundException('Produit #999 non trouvé')
      );
      
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a product', async () => {
      const createProductDto: CreateProductDto = {
        label: 'Test Product',
        quantity: 10,
        stock: 50,
        stock_min: 20,
        price_unit: 29.99,
        companyId: 1,
        tags: [1],
        statusId: 1
      };
      
      const result = await controller.create(createProductDto);
      
      expect(result).toEqual(mockProduct);
      expect(service.create).toHaveBeenCalledWith(createProductDto);
    });

    it('should throw NotFoundException if company not found', async () => {
      const createProductDto: CreateProductDto = {
        label: 'Test Product',
        quantity: 10,
        stock: 50,
        stock_min: 20,
        price_unit: 29.99,
        companyId: 999, // ID inexistant
        tags: [1],
        statusId: 1
      };
      
      jest.spyOn(service, 'create').mockRejectedValueOnce(
        new NotFoundException('Société avec ID 999 non trouvée')
      );
      
      await expect(controller.create(createProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto: UpdateProductDto = {
        label: 'Updated Product',
      };
      
      const result = await controller.update(1, updateProductDto);
      
      expect(result).toEqual({
        ...mockProduct,
        label: 'Updated Product',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateProductDto);
    });

    it('should throw NotFoundException if product to update not found', async () => {
      const updateProductDto: UpdateProductDto = {
        label: 'Updated Product',
      };
      
      jest.spyOn(service, 'update').mockRejectedValueOnce(
        new NotFoundException('Produit #999 non trouvé')
      );
      
      await expect(controller.update(999, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateStock', () => {
    it('should update product stock', async () => {
      const stockData = { quantitySold: 10 };
      
      const result = await controller.updateStock(1, stockData);
      
      expect(result).toEqual({
        ...mockProduct,
        stock: 40,
      });
      expect(service.updateStock).toHaveBeenCalledWith(1, 10);
    });

    it('should throw BadRequestException if quantitySold is negative', async () => {
      const stockData = { quantitySold: -5 };
      
      jest.spyOn(service, 'updateStock').mockRejectedValueOnce(
        new BadRequestException('La quantité vendue ne peut pas être négative.')
      );
      
      await expect(controller.updateStock(1, stockData)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if product not found', async () => {
      const stockData = { quantitySold: 10 };
      
      jest.spyOn(service, 'updateStock').mockRejectedValueOnce(
        new NotFoundException('Produit #999 non trouvé')
      );
      
      await expect(controller.updateStock(999, stockData)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const result = await controller.remove(1);
      
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if product to remove not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(
        new NotFoundException('Produit #999 non trouvé')
      );
      
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});