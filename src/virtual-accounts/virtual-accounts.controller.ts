import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { VirtualAccountsService } from './virtual-accounts.service.js';
import { CreateVirtualAccountDto } from './dto/create-virtual-account.dto.js';
import { UpdateVirtualAccountDto } from './dto/update-virtual-account.dto.js';

@Controller('virtual-accounts')
export class VirtualAccountsController {
  constructor(private readonly virtualAccountsService: VirtualAccountsService) {}

  @Post()
  create(@Body() createVirtualAccountDto: CreateVirtualAccountDto) {
    return this.virtualAccountsService.create(createVirtualAccountDto);
  }

  @Get()
  findAll() {
    return this.virtualAccountsService.findAll();
  }

  @Get('nomba/:identifier')
  lookup(@Param('identifier') identifier: string) {
    return this.virtualAccountsService.lookup(identifier);
  }

  @Patch('nomba/:identifier')
  update(
    @Param('identifier') identifier: string,
    @Body() updateVirtualAccountDto: UpdateVirtualAccountDto,
  ) {
    return this.virtualAccountsService.update(identifier, updateVirtualAccountDto);
  }

  @Delete('nomba/:identifier')
  suspend(@Param('identifier') identifier: string) {
    return this.virtualAccountsService.suspend(identifier);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.virtualAccountsService.findOne(id);
  }

  @Patch(':id')
  updateLocal(
    @Param('id') id: string,
    @Body() updateVirtualAccountDto: UpdateVirtualAccountDto,
  ) {
    return this.virtualAccountsService.updateLocal(id, updateVirtualAccountDto);
  }

  @Patch(':id/suspend')
  suspendLocal(@Param('id') id: string) {
    return this.virtualAccountsService.suspendLocal(id);
  }

  @Patch(':id/close')
  closeLocal(@Param('id') id: string) {
    return this.virtualAccountsService.closeLocal(id);
  }
}
