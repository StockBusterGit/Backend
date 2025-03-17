import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { Role } from '../roles/entities/role.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([
              {
                id: 1,
                username: 'testuser',
                email: 'test@example.com',
                role: { id: 1, name: 'admin' },
              },
            ]),
            create: jest.fn().mockResolvedValue({
              id: 1,
              username: 'testuser',
              email: 'test@example.com',
              role: { id: 1, name: 'admin' },
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const result = await controller.findAll();
      expect(result).toEqual([
        {
          id: 1,
          username: 'testuser',
          email: 'test@example.com',
          role: { id: 1, name: 'admin' },
        },
      ]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        password: 'password123',
        email: 'test@example.com',
        roleId: 1,
      };
      const result = await controller.create(createUserDto);
      expect(result).toEqual({
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        role: { id: 1, name: 'admin' },
      });
      expect(service.create).toHaveBeenCalledWith(createUserDto);
    });
  });
});