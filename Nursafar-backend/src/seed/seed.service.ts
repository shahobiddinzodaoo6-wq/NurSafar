import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    await this.seedAdmin();
  }

  private async seedAdmin() {
    const existing = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
    if (existing) {
      if (!existing.isApproved) {
        await this.prisma.user.update({ where: { id: existing.id }, data: { isApproved: true } });
        this.logger.log('Admin account approved flag updated');
      }
      return;
    }

    const hashed = await bcrypt.hash('AdminSuperSecret!', 12);
    await this.prisma.user.create({
      data: {
        name: 'NurSafar Admin',
        email: 'admin@nursafar.tj',
        phone: '+992000000000',
        password: hashed,
        role: 'ADMIN',
        isApproved: true,
      },
    });
    this.logger.log('Admin account seeded: admin@nursafar.tj');
  }
}
