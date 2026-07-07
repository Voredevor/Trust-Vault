import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBeneficiaryDto } from './dto/create-beneficiary.dto.js';
import { UpdateBeneficiaryDto } from './dto/update-beneficiary.dto.js';

@Injectable()
export class BeneficiariesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBeneficiaryDto: CreateBeneficiaryDto) {
    return this.prisma.beneficiary.create({
      data: {
        userId: createBeneficiaryDto.userId,
        displayName: createBeneficiaryDto.displayName,
        type: createBeneficiaryDto.type ?? 'BANK_ACCOUNT',
        status: createBeneficiaryDto.status ?? 'PENDING',
        bankName: createBeneficiaryDto.bankName,
        bankCode: createBeneficiaryDto.bankCode,
        accountName: createBeneficiaryDto.accountName,
        accountNumber: createBeneficiaryDto.accountNumber,
        externalReference: createBeneficiaryDto.externalReference,
        isTrusted: createBeneficiaryDto.isTrusted ?? false,
        metadata: createBeneficiaryDto.metadata as Prisma.InputJsonValue,
      },
    });
  }

  findAll() {
    return this.prisma.beneficiary.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.beneficiary.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  update(id: string, updateBeneficiaryDto: UpdateBeneficiaryDto) {
    return this.prisma.beneficiary.update({
      where: { id },
      data: {
        displayName: updateBeneficiaryDto.displayName,
        type: updateBeneficiaryDto.type,
        status: updateBeneficiaryDto.status,
        bankName: updateBeneficiaryDto.bankName,
        bankCode: updateBeneficiaryDto.bankCode,
        accountName: updateBeneficiaryDto.accountName,
        accountNumber: updateBeneficiaryDto.accountNumber,
        externalReference: updateBeneficiaryDto.externalReference,
        isTrusted: updateBeneficiaryDto.isTrusted,
        metadata: updateBeneficiaryDto.metadata as Prisma.InputJsonValue,
      },
    });
  }

  remove(id: string) {
    return this.prisma.beneficiary.delete({ where: { id } });
  }
}
