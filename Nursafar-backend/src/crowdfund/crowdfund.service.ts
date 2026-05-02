import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCrowdfundDto } from './dto/create-crowdfund.dto';
import { UpdateCrowdfundDto } from './dto/update-crowdfund.dto';
import { DonateDto } from './dto/donate.dto';

@Injectable()
export class CrowdfundService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCrowdfundDto) {
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

  async findOne(id: string) {
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
    if (!campaign) throw new NotFoundException(`Campaign ${id} not found`);
    return campaign;
  }

  async update(id: string, dto: UpdateCrowdfundDto) {
    await this.findOne(id);
    return this.prisma.crowdfundCampaign.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.crowdfundCampaign.delete({ where: { id } });
  }

  async donate(campaignId: string, donorId: string, dto: DonateDto) {
    const campaign = await this.findOne(campaignId);
    if (campaign.isCompleted) throw new BadRequestException('This campaign is already completed');

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
}
