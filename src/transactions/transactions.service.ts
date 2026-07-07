import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: {
        userId: createTransactionDto.userId,
        virtualAccountId: createTransactionDto.virtualAccountId,
        beneficiaryId: createTransactionDto.beneficiaryId,
        reference: createTransactionDto.reference,
        providerReference: createTransactionDto.providerReference,
        direction: createTransactionDto.direction,
        status: createTransactionDto.status ?? 'PENDING',
        amount: createTransactionDto.amount,
        currency: createTransactionDto.currency ?? 'NGN',
        narration: createTransactionDto.narration,
        metadata: createTransactionDto.metadata as Prisma.InputJsonValue,
      },
    });
  }

  findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        virtualAccount: true,
        beneficiary: true,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.transaction.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        virtualAccount: true,
        beneficiary: true,
      },
    });
  }

  update(id: string, updateTransactionDto: UpdateTransactionDto) {
    return this.prisma.transaction.update({
      where: { id },
      data: {
        providerReference: updateTransactionDto.providerReference,
        direction: updateTransactionDto.direction,
        status: updateTransactionDto.status,
        amount: updateTransactionDto.amount,
        currency: updateTransactionDto.currency,
        narration: updateTransactionDto.narration,
        metadata: updateTransactionDto.metadata as Prisma.InputJsonValue,
      },
    });
  }

  remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
