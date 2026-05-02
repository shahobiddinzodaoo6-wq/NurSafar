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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToursService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ToursService = class ToursService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(partnerId, dto) {
        return this.prisma.tour.create({
            data: { ...dto, partnerId },
            include: { partner: { select: { id: true, name: true, email: true } } },
        });
    }
    async search(filters) {
        const where = { isAvailable: true };
        if (filters.departureCity) {
            where.departureCity = { contains: filters.departureCity, mode: 'insensitive' };
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
    async findOne(id) {
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
    async update(id, partnerId, dto) {
        const tour = await this.findOne(id);
        if (tour.partnerId !== partnerId)
            throw new common_1.ForbiddenException('You do not own this tour');
        return this.prisma.tour.update({ where: { id }, data: dto });
    }
    async remove(id, partnerId) {
        const tour = await this.findOne(id);
        if (tour.partnerId !== partnerId)
            throw new common_1.ForbiddenException('You do not own this tour');
        return this.prisma.tour.delete({ where: { id } });
    }
    async book(tourId, userId) {
        const tour = await this.findOne(tourId);
        if (!tour.isAvailable)
            throw new common_1.BadRequestException('This tour is not available for booking');
        return this.prisma.booking.create({
            data: { userId, tourId },
            include: {
                tour: { select: { title: true, price: true, departureCity: true } },
                user: { select: { id: true, name: true, email: true } },
            },
        });
    }
    findUserBookings(userId) {
        return this.prisma.booking.findMany({
            where: { userId },
            include: { tour: true },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.ToursService = ToursService;
exports.ToursService = ToursService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ToursService);
//# sourceMappingURL=tours.service.js.map