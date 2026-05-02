import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';
import { UpdateLogisticsDto } from './dto/update-logistics.dto';

@Injectable()
export class LogisticsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateLogisticsDto) {
    return this.prisma.logistics.create({
      data: {
        ...dto,
        pickupTime: new Date(dto.pickupTime),
      },
      include: {
        booking: { include: { user: { select: { id: true, name: true } }, tour: { select: { title: true } } } },
        driver: { select: { id: true, name: true, phone: true } },
      },
    });
  }

  findAll() {
    return this.prisma.logistics.findMany({
      include: {
        booking: { include: { user: { select: { id: true, name: true } } } },
        driver: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.logistics.findUnique({
      where: { id },
      include: {
        booking: { include: { user: { select: { id: true, name: true } }, tour: true } },
        driver: { select: { id: true, name: true, phone: true } },
      },
    });
    if (!item) throw new NotFoundException(`Logistics ${id} not found`);
    return item;
  }

  async update(id: string, dto: UpdateLogisticsDto) {
    await this.findOne(id);
    const data: any = { ...dto };
    if (dto.pickupTime) data.pickupTime = new Date(dto.pickupTime as string);
    return this.prisma.logistics.update({ where: { id }, data });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.logistics.delete({ where: { id } });
  }

  findByDriver(driverId: string) {
    return this.prisma.logistics.findMany({
      where: { driverId },
      include: { booking: { include: { user: { select: { id: true, name: true } } } } },
      orderBy: { pickupTime: 'asc' },
    });
  }
}
