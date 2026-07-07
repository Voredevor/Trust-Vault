import { Module } from '@nestjs/common';
import { NombaService } from './nomba.service.js';
import { NombaController } from './nomba.controller.js';

@Module({
  providers: [NombaService],
  controllers: [NombaController],
  exports: [NombaService],
})
export class NombaModule {}
