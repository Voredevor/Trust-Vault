import { Controller, Get } from '@nestjs/common';
import { NombaService } from './nomba.service.js';

interface NombaAccountBalanceResponse {
	code: string;
	description: string;
	data: {
		amount: string;
		currency: string;
		timeCreated: string;
	};
}

@Controller('nomba')
export class NombaController {
	constructor(private readonly nombaService: NombaService) {}

	@Get('balance')
	getParentAccountBalance(): Promise<NombaAccountBalanceResponse> {
		return this.nombaService.fetchParentAccountBalance();
	}
}
