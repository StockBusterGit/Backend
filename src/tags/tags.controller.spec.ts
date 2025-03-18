import { Test, TestingModule } from '@nestjs/testing';
import { TagsController } from './tags.controller';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

describe('TagsController', () => {
  let controller: TagsController;
  let service: TagsService;

  const mockTag = { id: 1, label: 'Périssable', products: [] };
  const reqMock = { user: { id: 1, role: { name: 'ADMIN' } } };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagsController],
      providers: [
        {
          provide: TagsService,
          useValue: {
            findAllByUser: jest.fn().mockResolvedValue([mockTag]),
            create: jest.fn().mockResolvedValue(mockTag),
            update: jest
              .fn()
              .mockResolvedValue({ ...mockTag, label: 'Mis à jour' }),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
    service = module.get<TagsService>(TagsService);
  });

  describe('findAll', () => {
    it('should return an array of tags', async () => {
      const result = await controller.findAll(reqMock);
      expect(result).toEqual([mockTag]);
      expect(service.findAllByUser).toHaveBeenCalledWith(reqMock.user);
    });
  });

  describe('create', () => {
    it('should create a new tag', async () => {
      const dto: CreateTagDto = { label: 'Périssable', productIds: [] };
      const result = await controller.create(dto, reqMock);
      expect(result).toEqual(mockTag);
      expect(service.create).toHaveBeenCalledWith(dto, reqMock.user);
    });
  });
});
