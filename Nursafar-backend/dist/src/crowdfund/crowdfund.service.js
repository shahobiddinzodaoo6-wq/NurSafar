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
exports.CrowdfundService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CrowdfundService = class CrowdfundService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, dto) {
        return this.prisma.crowdfundCampaign.create({
            data: { ...dto, userId },
            include: { user: { select: { id: true, name: true } } },
        });
    }
    findAll() {
        return this.prisma.crowdfundCampaign.findMany({
            include: {
                user: { select: { id: true, name: true } },
                _count: { select: { donations: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const campaign = await this.prisma.crowdfundCampaign.findUnique({
            where: { id },
            include: {
                user: { select: { id: true, name: true } },
                donations: {
                    include: { donor: { select: { id: true, name: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 10,
                },
                _count: { select: { donations: true } },
            },
        });
        if (!campaign)
            throw new common_1.NotFoundException(`Campaign ${id} not found`);
        return campaign;
    }
    async update(id, dto) {
        await this.findOne(id);
        return this.prisma.crowdfundCampaign.update({ where: { id }, data: dto });
    }
    async remove(id) {
        await this.findOne(id);
        return this.prisma.crowdfundCampaign.delete({ where: { id } });
    }
    async donate(campaignId, donorId, dto) {
        const campaign = await this.findOne(campaignId);
        if (campaign.isCompleted)
            throw new common_1.BadRequestException('This campaign is already completed');
        const newAmount = campaign.currentAmount + dto.amount;
        const isCompleted = newAmount >= campaign.targetAmount;
        const [donation] = await this.prisma.$transaction([
            this.prisma.donation.create({
                data: { campaignId, donorId, amount: dto.amount, message: dto.message },
                include: { donor: { select: { id: true, name: true } } },
            }),
            this.prisma.crowdfundCampaign.update({
                where: { id: campaignId },
                data: { currentAmount: newAmount, isCompleted },
            }),
        ]);
        return donation;
    }
};
exports.CrowdfundService = CrowdfundService;
exports.CrowdfundService = CrowdfundService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrowdfundService);
//# sourceMappingURL=crowdfund.service.js.map