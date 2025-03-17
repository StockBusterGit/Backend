import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthController } from './health.controller';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

describe('AppController', () => {
  let appController: AppController;
  let healthController: HealthController;
  let appService: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController, HealthController],
      providers: [AppService],
    }).compile();

    appController = module.get<AppController>(AppController);
    healthController = module.get<HealthController>(HealthController);
    appService = module.get<AppService>(AppService);
  });

  describe('health', () => {
    it('should return "Service is healthy"', () => {
      expect(healthController.checkHealth()).toBe('Service is healthy');
    });
  });

  describe('protected', () => {
    it('should return protected data', () => {
      const mockGuard = { canActivate: jest.fn(() => true) };
      Reflect.defineMetadata('guards', [mockGuard], appController.getProtectedData);

      const result = appController.getProtectedData();
      expect(result).toEqual({ message: 'This is a protected route' });
    });
  });
});