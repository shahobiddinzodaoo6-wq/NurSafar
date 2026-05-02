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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const userSelect = { id: true, name: true, email: true, phone: true, role: true, isApproved: true, createdAt: true };
let UsersService = class UsersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    findAll() {
        return this.prisma.user.findMany({ select: userSelect });
    }
    findPendingPartners() {
        return this.prisma.user.findMany({
            where: { role: { in: ['PARTNER', 'DRIVER'] }, isApproved: false },
            select: userSelect,
            orderBy: { createdAt: 'asc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({ where: { id }, select: userSelect });
        if (!user)
            throw new common_1.NotFoundException(`User ${id} not found`);
        return user;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.user.update({ where: { id }, data: dto, select: userSelect });
    }
    async approveUser(id) {
        await this.findOne(id);
        return this.prisma.user.update({ where: { id }, data: { isApproved: true }, select: userSelect });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.user.delete({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map