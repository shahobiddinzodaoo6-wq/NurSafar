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
exports.LogisticsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let LogisticsService = class LogisticsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(dto) {
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
    async findOne(id) {
        const item = await this.prisma.logistics.findUnique({
            where: { id },
            include: {
                booking: { include: { user: { select: { id: true, name: true } }, tour: true } },
                driver: { select: { id: true, name: true, phone: true } },
            },
        });
        if (!item)
            throw new common_1.NotFoundException(`Logistics ${id} not found`);
        return item;
    }
    async update(id, dto) {
        await this.findOne(id);
        const data = { ...dto };
        if (dto.pickupTime)
            data.pickupTime = new Date(dto.pickupTime);
        return this.prisma.logistics.update({ where: { id }, data });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.logistics.delete({ where: { id } });
    }
    findByDriver(driverId) {
        return this.prisma.logistics.findMany({
            where: { driverId },
            include: {
                booking: {
                    include: {
                        user: { select: { id: true, name: true, phone: true } },
                        tour: { select: { id: true, title: true } },
                    },
                },
            },
            orderBy: { pickupTime: 'asc' },
        });
    }
    async updateStatus(id, driverId, status) {
        const item = await this.findOne(id);
        if (item.driverId !== driverId) {
            throw new common_1.ForbiddenException('You are not assigned to this trip');
        }
        return this.prisma.logistics.update({
            where: { id },
            data: { status },
            include: {
                booking: {
                    include: {
                        user: { select: { id: true, name: true, phone: true } },
                        tour: { select: { id: true, title: true } },
                    },
                },
                driver: { select: { id: true, name: true } },
            },
        });
    }
};
exports.LogisticsService = LogisticsService;
exports.LogisticsService = LogisticsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], LogisticsService);
//# sourceMappingURL=logistics.service.js.map