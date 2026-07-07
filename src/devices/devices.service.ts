import { Injectable } from '@nestjs/common';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateDeviceDto } from './dto/create-device.dto.js';
import { UpdateDeviceDto } from './dto/update-device.dto.js';

@Injectable()
export class DevicesService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDeviceDto: CreateDeviceDto) {
    return this.prisma.device.create({
      data: {
        userId: createDeviceDto.userId,
        name: createDeviceDto.name,
        fingerprint: createDeviceDto.fingerprint,
        status: createDeviceDto.status ?? 'PENDING',
        trustedAt: createDeviceDto.status === 'TRUSTED' ? new Date() : undefined,
        metadata: createDeviceDto.metadata as Prisma.InputJsonValue,
      },
    });
  }

  findAll() {
    return this.prisma.device.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.device.findUniqueOrThrow({
      where: { id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  update(id: string, updateDeviceDto: UpdateDeviceDto) {
    return this.prisma.device.update({
      where: { id },
      data: {
        name: updateDeviceDto.name,
        status: updateDeviceDto.status,
        trustedAt: updateDeviceDto.status === 'TRUSTED' ? new Date() : undefined,
        lastSeenAt: new Date(),
        metadata: updateDeviceDto.metadata as Prisma.InputJsonValue,
      },
    });
  }

  remove(id: string) {
    return this.prisma.device.delete({ where: { id } });
  }
}
