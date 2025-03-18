import { Test, TestingModule } from '@nestjs/testing';
import { CompaniesController } from './companies.controller';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { NotFoundException } from '@nestjs/common';

describe('CompaniesController', () => {
  let controller: CompaniesController;
  let service: CompaniesService;

  const mockCompany = {
    id: 1,
    name: 'Test Company',
    owner: { id: 1, username: 'testuser', email: 'test@example.com' },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompaniesController],
      providers: [
        {
          provide: CompaniesService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockCompany),
            findAll: jest.fn().mockResolvedValue([mockCompany]),
            findOne: jest.fn().mockResolvedValue(mockCompany),
            update: jest.fn().mockResolvedValue({
              ...mockCompany,
              name: 'Updated Company',
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<CompaniesController>(CompaniesController);
    service = module.get<CompaniesService>(CompaniesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a company', async () => {
      const createCompanyDto: CreateCompanyDto = {
        name: 'Test Company',
        userId: 1,
      };

      const result = await controller.create(createCompanyDto);

      expect(result).toEqual(mockCompany);
      expect(service.create).toHaveBeenCalledWith(createCompanyDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of companies', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockCompany]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single company', async () => {
      const result = await controller.findOne(1);

      expect(result).toEqual(mockCompany);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if company not found', async () => {
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValueOnce(new NotFoundException('Company #999 not found'));

      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a company', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
      };

      const result = await controller.update(1, updateCompanyDto);

      expect(result).toEqual({
        ...mockCompany,
        name: 'Updated Company',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateCompanyDto);
    });

    it('should throw NotFoundException if company to update not found', async () => {
      const updateCompanyDto: UpdateCompanyDto = {
        name: 'Updated Company',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValueOnce(new NotFoundException('Company #999 not found'));

      await expect(controller.update(999, updateCompanyDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a company', async () => {
      const result = await controller.remove(1);

      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if company to remove not found', async () => {
      jest
        .spyOn(service, 'remove')
        .mockRejectedValueOnce(new NotFoundException('Company #999 not found'));

      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});
