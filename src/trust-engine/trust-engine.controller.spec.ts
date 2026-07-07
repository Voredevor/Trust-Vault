import { Test, TestingModule } from '@nestjs/testing';

jest.mock('../generated/prisma/client', () => {
	class PrismaClientMock {
		async $connect(): Promise<void> {}
		async $disconnect(): Promise<void> {}
	}

	return {
		PrismaClient: PrismaClientMock,
	};
});

import { TrustEngineController } from './trust-engine.controller.js';
import { TrustEngineService } from './trust-engine.service.js';

describe('TrustEngineController', () => {
	let controller: TrustEngineController;
	let trustEngineService: {
		assessUserTrust: jest.Mock;
		decideUserTrust: jest.Mock;
	};

	beforeEach(async () => {
		trustEngineService = {
			assessUserTrust: jest.fn(),
			decideUserTrust: jest.fn(),
		};

		const module: TestingModule = await Test.createTestingModule({
			controllers: [TrustEngineController],
			providers: [
				{
					provide: TrustEngineService,
					useValue: trustEngineService,
				},
			],
		}).compile();

		controller = module.get<TrustEngineController>(TrustEngineController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('forwards trust score requests to the service', () => {
		controller.getUserTrustScore('user-1');

		expect(trustEngineService.assessUserTrust).toHaveBeenCalledWith('user-1');
	});

	it('forwards trust decision requests to the service', () => {
		controller.getUserTrustDecision('user-2');

		expect(trustEngineService.decideUserTrust).toHaveBeenCalledWith('user-2');
	});
});