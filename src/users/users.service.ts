import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const passwordHash = await bcrypt.hash(createUserDto.password ?? 'TrustVaultTemp123!', 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        phoneNumber: createUserDto.phoneNumber,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        passwordHash,
        status: createUserDto.status ?? 'ACTIVE',
        role: createUserDto.role ?? 'USER',
      },
      select: this.userSelect,
    });
  }

  findAll(includeArchived = false) {
    return this.prisma.user.findMany({
      where: includeArchived ? undefined : { deletedAt: null },
      orderBy: { createdAt: 'desc' },
      select: {
        ...this.userSelect,
        virtualAccounts: {
          select: { id: true, status: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...this.userSelect,
        devices: true,
        beneficiaries: true,
        virtualAccounts: true,
        transactions: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }

    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        email: updateUserDto.email,
        phoneNumber: updateUserDto.phoneNumber,
        firstName: updateUserDto.firstName,
        lastName: updateUserDto.lastName,
        status: updateUserDto.status,
        role: updateUserDto.role,
      },
      select: this.userSelect,
    });
  }

  remove(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: this.userSelect,
    });
  }

  restore(id: string) {
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: this.userSelect,
    });
  }

  private readonly userSelect = {
    id: true,
    email: true,
    phoneNumber: true,
    firstName: true,
    lastName: true,
    role: true,
    status: true,
    deletedAt: true,
    createdAt: true,
    updatedAt: true,
  } as const;
}
