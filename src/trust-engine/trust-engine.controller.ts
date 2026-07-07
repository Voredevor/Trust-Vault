import { Controller, Get, Param } from '@nestjs/common';
import { TrustEngineService } from './trust-engine.service.js';

@Controller('trust-engine')
export class TrustEngineController {
	constructor(private readonly trustEngineService: TrustEngineService) {}

	@Get('users/:userId/score')
	getUserTrustScore(@Param('userId') userId: string) {
		return this.trustEngineService.assessUserTrust(userId);
	}

	@Get('users/:userId/decision')
	getUserTrustDecision(@Param('userId') userId: string) {
		return this.trustEngineService.decideUserTrust(userId);
	}
}