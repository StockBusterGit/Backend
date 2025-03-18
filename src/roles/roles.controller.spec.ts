import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

describe('RolesController', () => {
  let controller: RolesController;
  let service: RolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([{ id: 1, name: 'Admin' }]),
            create: jest.fn().mockResolvedValue({ id: 2, name: 'User' }),
          },
        },
      ],
    }).compile();

    controller = module.get<RolesController>(RolesController);
    service = module.get<RolesService>(RolesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of roles', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([{ id: 1, name: 'Admin' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new role', async () => {
      const roleData = { name: 'User' }; 
      const result = await controller.create(roleData);
      expect(result).toEqual({ id: 2, name: 'User' });
      expect(service.create).toHaveBeenCalledWith(roleData);
    });
  });
});