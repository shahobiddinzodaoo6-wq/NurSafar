import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';

@Injectable()
export class ToursService {
  constructor(private readonly prisma: PrismaService) {}

  async create(partnerId: string, dto: CreateTourDto) {
    return this.prisma.tour.create({
      data: { ...dto, partnerId },
      include: { partner: { select: { id: true, name: true, email: true } } },
    });
  }

  async search(filters: SearchTourDto) {
    const where: any = { isAvailable: true };
    if (filters.departureCity) {
      where.departureCity = { contains: filters.departureCity, mode: 'insensitive' };
    }
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }
    if (filters.minStars !== undefined) {
      where.hotelStars = { gte: filters.minStars };
    }
    if (filters.maxDistance !== undefined) {
      where.distanceToHaram = { lte: filters.maxDistance };
    }
    return this.prisma.tour.findMany({
      where,
      include: { partner: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findAll() {
    return this.prisma.tour.findMany({
      include: { partner: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const tour = await this.prisma.tour.findUnique({
      where: { id },
      include: {
        partner: { select: { id: true, name: true, email: true, phone: true } },
        _count: { select: { bookings: true } },
      },
    });
    if (!tour) throw new NotFoundException(`Tour ${id} not found`);
    return tour;
  }

  async update(id: string, partnerId: string, dto: UpdateTourDto) {
    const tour = await this.findOne(id);
    if (tour.partnerId !== partnerId) throw new ForbiddenException('You do not own this tour');
    return this.prisma.tour.update({ where: { id }, data: dto });
  }

  async remove(id: string, partnerId: string) {
    const tour = await this.findOne(id);
    if (tour.partnerId !== partnerId) throw new ForbiddenException('You do not own this tour');
    return this.prisma.tour.delete({ where: { id } });
  }

  async book(tourId: string, userId: string) {
    const tour = await this.findOne(tourId);
    if (!tour.isAvailable) throw new BadRequestException('This tour is not available for booking');
    return this.prisma.booking.create({
      data: { userId, tourId },
      include: {
        tour: { select: { title: true, price: true, departureCity: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    });
  }

  findUserBookings(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { tour: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPartnerTours(partnerId: string) {
    return this.prisma.tour.findMany({
      where: { partnerId },
      include: { _count: { select: { bookings: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPartnerStats(partnerId: string) {
    const tours = await this.prisma.tour.findMany({
      where: { partnerId },
      select: { id: true, price: true, isAvailable: true },
    });
    const bookings = await this.prisma.booking.findMany({
      where: { tour: { partnerId } },
      select: { tourId: true },
    });
    const activeTours = tours.filter((t) => t.isAvailable).length;
    const totalClients = bookings.length;
    const totalRevenue = tours.reduce((sum, t) => {
      const count = bookings.filter((b) => b.tourId === t.id).length;
      return sum + t.price * count;
    }, 0);
    return { activeTours, totalClients, totalRevenue };
  }

  findPartnerClients(partnerId: string) {
    return this.prisma.booking.findMany({
      where: { tour: { partnerId } },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true } },
        tour: { select: { id: true, title: true, price: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
