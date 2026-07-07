import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAuditDto } from './dto/create-audit.dto.js';
import { UpdateAuditDto } from './dto/update-audit.dto.js';

@Injectable()
export class AuditService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAuditDto: CreateAuditDto) {
    return this.prisma.auditLog.create({
      data: {
        userId: createAuditDto.userId,
        actorType: createAuditDto.actorType ?? 'SYSTEM',
        action: createAuditDto.action,
        resourceType: createAuditDto.resourceType,
        resourceId: createAuditDto.resourceId,
        severity: createAuditDto.severity ?? 'LOW',
        metadata: createAuditDto.metadata as Prisma.InputJsonValue,
        ipAddress: createAuditDto.ipAddress,
        userAgent: createAuditDto.userAgent,
      },
    });
  }

  findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.auditLog.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  update(id: string, updateAuditDto: UpdateAuditDto) {
    return this.prisma.auditLog.update({
      where: { id },
      data: {
        actorType: updateAuditDto.actorType,
        action: updateAuditDto.action,
        resourceType: updateAuditDto.resourceType,
        resourceId: updateAuditDto.resourceId,
        severity: updateAuditDto.severity,
        metadata: updateAuditDto.metadata as Prisma.InputJsonValue,
        ipAddress: updateAuditDto.ipAddress,
        userAgent: updateAuditDto.userAgent,
      },
    });
  }

  remove(id: string) {
    return this.prisma.auditLog.delete({ where: { id } });
  }
}
