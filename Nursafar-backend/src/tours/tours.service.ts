import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';

@Injectable()
export class ToursService {
  private readonly logger = new Logger(ToursService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(partnerId: string, dto: CreateTourDto) {
    try {
      return await this.prisma.tour.create({
        data: { ...dto, partnerId },
        include: { partner: { select: { id: true, name: true, email: true } } },
      });
    } catch (error) {
      this.logger.error('create tour failed', error);
      throw new InternalServerErrorException('Failed to create tour');
    }
  }

  async search(filters: SearchTourDto) {
    const where: any = { isAvailable: true };
    if (filters.departureCity) {
      where.departureCity = { contains: filters.departureCity };
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
    try {
      return await this.prisma.tour.findMany({
        where,
        include: { partner: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('search tours failed', error);
      throw new InternalServerErrorException('Failed to search tours');
    }
  }

  async findAll() {
    try {
      return await this.prisma.tour.findMany({
        include: { partner: { select: { id: true, name: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('findAll tours failed', error);
      throw new InternalServerErrorException('Failed to fetch tours');
    }
  }

  async findOne(id: string) {
    try {
      const tour = await this.prisma.tour.findUnique({
        where: { id },
        include: {
          partner: { select: { id: true, name: true, email: true, phone: true } },
          _count: { select: { bookings: true } },
        },
      });
      if (!tour) throw new NotFoundException(`Tour ${id} not found`);
      return tour;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`findOne tour ${id} failed`, error);
      throw new InternalServerErrorException('Failed to fetch tour');
    }
  }

  async update(id: string, partnerId: string, dto: UpdateTourDto) {
    const tour = await this.findOne(id);
    if (tour.partnerId !== partnerId) throw new ForbiddenException('You do not own this tour');
    try {
      return await this.prisma.tour.update({ where: { id }, data: dto });
    } catch (error) {
      this.logger.error(`update tour ${id} failed`, error);
      throw new InternalServerErrorException('Failed to update tour');
    }
  }

  async remove(id: string, partnerId: string) {
    const tour = await this.findOne(id);
    if (tour.partnerId !== partnerId) throw new ForbiddenException('You do not own this tour');
    try {
      return await this.prisma.tour.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`remove tour ${id} failed`, error);
      throw new InternalServerErrorException('Failed to delete tour');
    }
  }

  async book(tourId: string, userId: string) {
    const tour = await this.findOne(tourId);
    if (!tour.isAvailable) throw new BadRequestException('This tour is not available for booking');
    try {
      return await this.prisma.booking.create({
        data: { userId, tourId },
        include: {
          tour: { select: { title: true, price: true, departureCity: true } },
          user: { select: { id: true, name: true, email: true } },
        },
      });
    } catch (error) {
      this.logger.error(`book tour ${tourId} failed`, error);
      throw new InternalServerErrorException('Failed to create booking');
    }
  }

  async findUserBookings(userId: string) {
    try {
      return await this.prisma.booking.findMany({
        where: { userId },
        include: { tour: true },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`findUserBookings for ${userId} failed`, error);
      throw new InternalServerErrorException('Failed to fetch bookings');
    }
  }

  async findPartnerTours(partnerId: string) {
    try {
      return await this.prisma.tour.findMany({
        where: { partnerId },
        include: { _count: { select: { bookings: true } } },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`findPartnerTours for ${partnerId} failed`, error);
      throw new InternalServerErrorException('Failed to fetch partner tours');
    }
  }

  async getPartnerStats(partnerId: string) {
    try {
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
    } catch (error) {
      this.logger.error(`getPartnerStats for ${partnerId} failed`, error);
      throw new InternalServerErrorException('Failed to fetch partner stats');
    }
  }

  async findPartnerClients(partnerId: string) {
    try {
      return await this.prisma.booking.findMany({
        where: { tour: { partnerId } },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
          tour: { select: { id: true, title: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error(`findPartnerClients for ${partnerId} failed`, error);
      throw new InternalServerErrorException('Failed to fetch partner clients');
    }
  }
}
