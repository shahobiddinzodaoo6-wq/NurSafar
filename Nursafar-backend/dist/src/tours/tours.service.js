"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ToursService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ToursService = ToursService_1 = class ToursService {
    prisma;
    logger = new common_1.Logger(ToursService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(partnerId, dto) {
        try {
            return await this.prisma.tour.create({
                data: { ...dto, partnerId },
                include: { partner: { select: { id: true, name: true, email: true } } },
            });
        }
        catch (error) {
            this.logger.error('create tour failed', error);
            throw new common_1.InternalServerErrorException('Failed to create tour');
        }
    }
    async search(filters) {
        const where = { isAvailable: true };
        if (filters.departureCity) {
            where.departureCity = { contains: filters.departureCity };
        }
        if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
            where.price = {};
            if (filters.minPrice !== undefined)
                where.price.gte = filters.minPrice;
            if (filters.maxPrice !== undefined)
                where.price.lte = filters.maxPrice;
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
        }
        catch (error) {
            this.logger.error('search tours failed', error);
            throw new common_1.InternalServerErrorException('Failed to search tours');
        }
    }
    async findAll() {
        try {
            return await this.prisma.tour.findMany({
                include: { partner: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error('findAll tours failed', error);
            throw new common_1.InternalServerErrorException('Failed to fetch tours');
        }
    }
    async findOne(id) {
        try {
            const tour = await this.prisma.tour.findUnique({
                where: { id },
                include: {
                    partner: { select: { id: true, name: true, email: true, phone: true } },
                    _count: { select: { bookings: true } },
                },
            });
            if (!tour)
                throw new common_1.NotFoundException(`Tour ${id} not found`);
            return tour;
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException)
                throw error;
            this.logger.error(`findOne tour ${id} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to fetch tour');
        }
    }
    async update(id, partnerId, dto) {
        const tour = await this.findOne(id);
        if (tour.partnerId !== partnerId)
            throw new common_1.ForbiddenException('You do not own this tour');
        try {
            return await this.prisma.tour.update({ where: { id }, data: dto });
        }
        catch (error) {
            this.logger.error(`update tour ${id} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to update tour');
        }
    }
    async remove(id, partnerId) {
        const tour = await this.findOne(id);
        if (tour.partnerId !== partnerId)
            throw new common_1.ForbiddenException('You do not own this tour');
        try {
            return await this.prisma.tour.delete({ where: { id } });
        }
        catch (error) {
            this.logger.error(`remove tour ${id} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to delete tour');
        }
    }
    async book(tourId, userId) {
        const tour = await this.findOne(tourId);
        if (!tour.isAvailable)
            throw new common_1.BadRequestException('This tour is not available for booking');
        try {
            return await this.prisma.booking.create({
                data: { userId, tourId },
                include: {
                    tour: { select: { title: true, price: true, departureCity: true } },
                    user: { select: { id: true, name: true, email: true } },
                },
            });
        }
        catch (error) {
            this.logger.error(`book tour ${tourId} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to create booking');
        }
    }
    async findUserBookings(userId) {
        try {
            return await this.prisma.booking.findMany({
                where: { userId },
                include: { tour: true },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error(`findUserBookings for ${userId} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to fetch bookings');
        }
    }
    async findPartnerTours(partnerId) {
        try {
            return await this.prisma.tour.findMany({
                where: { partnerId },
                include: { _count: { select: { bookings: true } } },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error(`findPartnerTours for ${partnerId} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to fetch partner tours');
        }
    }
    async getPartnerStats(partnerId) {
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
        }
        catch (error) {
            this.logger.error(`getPartnerStats for ${partnerId} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to fetch partner stats');
        }
    }
    async findPartnerClients(partnerId) {
        try {
            return await this.prisma.booking.findMany({
                where: { tour: { partnerId } },
                include: {
                    user: { select: { id: true, name: true, email: true, phone: true } },
                    tour: { select: { id: true, title: true, price: true } },
                },
                orderBy: { createdAt: 'desc' },
            });
        }
        catch (error) {
            this.logger.error(`findPartnerClients for ${partnerId} failed`, error);
            throw new common_1.InternalServerErrorException('Failed to fetch partner clients');
        }
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = ToursService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ToursService);
//# sourceMappingURL=tours.service.js.map