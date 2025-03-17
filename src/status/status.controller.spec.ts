import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { NotFoundException } from '@nestjs/common';
import { Status } from './entities/status.entity';

describe('StatusController', () => {
  let controller: StatusController;
  let service: StatusService;

  const mockStatus: Status = {
    id: 1,
    label: 'Actif',
    products: []
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([mockStatus]),
            findOne: jest.fn().mockResolvedValue(mockStatus),
            create: jest.fn().mockResolvedValue(mockStatus),
            update: jest.fn().mockResolvedValue({
              ...mockStatus,
              label: 'Mis à jour',
            }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    service = module.get<StatusService>(StatusService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of statuses', async () => {
      const result = await controller.findAll();
      
      expect(result).toEqual([mockStatus]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single status', async () => {
      const result = await controller.findOne(1);
      
      expect(result).toEqual(mockStatus);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if status not found', async () => {
      jest.spyOn(service, 'findOne').mockRejectedValueOnce(
        new NotFoundException('Statut #999 non trouvé')
      );
      
      await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create a status', async () => {
      const createStatusDto: CreateStatusDto = {
        label: 'Actif',
      };
      
      const result = await controller.create(createStatusDto);
      
      expect(result).toEqual(mockStatus);
      expect(service.create).toHaveBeenCalledWith(createStatusDto);
    });

    it('should throw NotFoundException if status already exists', async () => {
      const createStatusDto: CreateStatusDto = {
        label: 'Actif',
      };
      
      jest.spyOn(service, 'create').mockRejectedValueOnce(
        new NotFoundException('Le statut "Actif" existe déjà.')
      );
      
      await expect(controller.create(createStatusDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a status', async () => {
      const updateStatusDto: UpdateStatusDto = {
        label: 'Mis à jour',
      };
      
      const result = await controller.update(1, updateStatusDto);
      
      expect(result).toEqual({
        ...mockStatus,
        label: 'Mis à jour',
      });
      expect(service.update).toHaveBeenCalledWith(1, updateStatusDto);
    });

    it('should throw NotFoundException if status to update not found', async () => {
      const updateStatusDto: UpdateStatusDto = {
        label: 'Mis à jour',
      };
      
      jest.spyOn(service, 'update').mockRejectedValueOnce(
        new NotFoundException('Statut #999 non trouvé')
      );
      
      await expect(controller.update(999, updateStatusDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a status', async () => {
      const result = await controller.remove(1);
      
      expect(result).toBeUndefined();
      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if status to remove not found', async () => {
      jest.spyOn(service, 'remove').mockRejectedValueOnce(
        new NotFoundException('Statut #999 non trouvé')
      );
      
      await expect(controller.remove(999)).rejects.toThrow(NotFoundException);
    });
  });
});