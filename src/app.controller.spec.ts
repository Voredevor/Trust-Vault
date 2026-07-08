import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return the dashboard html', () => {
      expect(appController.getHello()).toContain('TrustVault Operator Console');
      expect(appController.getHello()).toContain('Security Overview');
      expect(appController.getHello()).toContain('Transfer Guard');
    });
  });
});
