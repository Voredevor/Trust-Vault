import { Injectable } from '@nestjs/common';
import { NombaService } from '../nomba/nomba.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateVirtualAccountDto } from './dto/create-virtual-account.dto.js';
import { UpdateVirtualAccountDto } from './dto/update-virtual-account.dto.js';

@Injectable()
export class VirtualAccountsService {
  constructor(
    private readonly nombaService: NombaService,
    private readonly prismaService: PrismaService,
  ) {}

  async create(createVirtualAccountDto: CreateVirtualAccountDto) {
    const { userId, ...nombaPayload } = createVirtualAccountDto;
    const nombaResponse = await this.nombaService.createSubAccountVirtualAccount(
      nombaPayload,
    );

    return this.prismaService.virtualAccount.create({
      data: {
        userId: userId || null,
        label: createVirtualAccountDto.accountName,
        accountName: nombaResponse.data.accountName,
        accountNumber: nombaResponse.data.bankAccountNumber,
        bankCode: null,
        providerReference: createVirtualAccountDto.accountRef,
        metadata: JSON.parse(JSON.stringify(nombaResponse.data)),
      },
    });
  }

  findAll() {
    return this.prismaService.virtualAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prismaService.virtualAccount.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });
  }

  updateLocal(id: string, updateVirtualAccountDto: UpdateVirtualAccountDto) {
    return this.prismaService.virtualAccount.update({
      where: { id },
      data: {
        label: updateVirtualAccountDto.accountName,
        accountName: updateVirtualAccountDto.accountName,
        providerReference: updateVirtualAccountDto.newAccountRef,
      },
    });
  }

  suspendLocal(id: string) {
    return this.prismaService.virtualAccount.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  closeLocal(id: string) {
    return this.prismaService.virtualAccount.update({
      where: { id },
      data: { status: 'CLOSED' },
    });
  }

  async update(identifier: string, updateVirtualAccountDto: UpdateVirtualAccountDto) {
    const nombaResponse = await this.nombaService.updateVirtualAccount(
      identifier,
      updateVirtualAccountDto,
    );

    return this.prismaService.virtualAccount.updateMany({
      where: {
        providerReference: identifier,
      },
      data: {
        label: updateVirtualAccountDto.accountName,
        accountName: updateVirtualAccountDto.accountName,
        providerReference: updateVirtualAccountDto.newAccountRef ?? identifier,
        metadata: JSON.parse(JSON.stringify(nombaResponse.data)),
      },
    });
  }

  async suspend(identifier: string) {
    const nombaResponse = await this.nombaService.expireVirtualAccount(identifier);

    return this.prismaService.virtualAccount.updateMany({
      where: {
        providerReference: identifier,
      },
      data: {
        status: 'INACTIVE',
        metadata: JSON.parse(JSON.stringify(nombaResponse.data)),
      },
    });
  }

  async lookup(identifier: string) {
    return this.nombaService.fetchVirtualAccount(identifier);
  }
}
