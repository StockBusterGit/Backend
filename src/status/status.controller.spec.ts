import { Test, TestingModule } from '@nestjs/testing';
import { StatusController } from './status.controller';
import { StatusService } from './status.service';

describe('StatusController', () => {
  let controller: StatusController;
  let service: StatusService;

  const mockStatus = { id: 1, label: 'Actif', products: [] };
  const reqMock = { user: { id: 1, role: { name: 'ADMIN' } } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StatusController],
      providers: [
        {
          provide: StatusService,
          useValue: {
            findAllByUser: jest.fn().mockResolvedValue([mockStatus]),
            findOneByUser: jest.fn().mockResolvedValue(mockStatus),
            create: jest.fn().mockResolvedValue(mockStatus),
            update: jest.fn().mockResolvedValue({ ...mockStatus, label: 'Mis à jour' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<StatusController>(StatusController);
    service = module.get<StatusService>(StatusService);
  });

  describe('findAll', () => {
    it('should return an array of statuses', async () => {
      const result = await controller.findAll(reqMock);
      expect(result).toEqual([mockStatus]);
      expect(service.findAllByUser).toHaveBeenCalledWith(reqMock.user);
    });
  });

  describe('findOne', () => {
    it('should return a single status', async () => {
      const result = await controller.findOne(1, reqMock);
      expect(result).toEqual(mockStatus);
      expect(service.findOneByUser).toHaveBeenCalledWith(1, reqMock.user);
    });
  });
});
