import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductService } from './products.service';
import { NotFoundException } from '@nestjs/common';
import { ProductStatus } from './enums/product-status.enum';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductService;

  const mockProduct = {
    id: 1,
    label: 'Test Product',
    quantity: 10,
    stock: 50,
    stock_min: 20,
    price_unit: 29.99,
    status: ProductStatus.ACTIVE,
  };

  const reqMock = { user: { id: 1, role: { name: 'USER' } } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductService,
          useValue: {
            findAllByUser: jest.fn().mockResolvedValue([mockProduct]),
            findOneByUser: jest.fn().mockResolvedValue(mockProduct),
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

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of products', async () => {
      const result = await controller.findAll(reqMock);
      expect(result).toEqual([mockProduct]);
      expect(service.findAllByUser).toHaveBeenCalledWith(reqMock.user);
    });
  });

  describe('findOne', () => {
    it('should return a single product', async () => {
      const result = await controller.findOne(1, reqMock);
      expect(result).toEqual(mockProduct);
      expect(service.findOneByUser).toHaveBeenCalledWith(1, reqMock.user);
    });

    it('should throw NotFoundException if product not found', async () => {
      jest
        .spyOn(service, 'findOneByUser')
        .mockRejectedValueOnce(
          new NotFoundException('Produit #999 non trouvé'),
        );
      await expect(controller.findOne(999, reqMock)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
