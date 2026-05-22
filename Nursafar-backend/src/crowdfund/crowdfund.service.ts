import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCrowdfundDto } from './dto/create-crowdfund.dto';
import { UpdateCrowdfundDto } from './dto/update-crowdfund.dto';
import { DonateDto } from './dto/donate.dto';

@Injectable()
export class CrowdfundService {
  private readonly logger = new Logger(CrowdfundService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateCrowdfundDto) {
    try {
      return await this.prisma.crowdfundCampaign.create({
        data: { ...dto, userId },
        include: { user: { select: { id: true, name: true } } },
      });
    } catch (error) {
      this.logger.error('create campaign failed', error);
      throw new InternalServerErrorException('Failed to create campaign');
    }
  }

  async findAll() {
    try {
      return await this.prisma.crowdfundCampaign.findMany({
        include: {
          user: { select: { id: true, name: true } },
          _count: { select: { donations: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (error) {
      this.logger.error('findAll campaigns failed', error);
      throw new InternalServerErrorException('Failed to fetch campaigns');
    }
  }

  async findOne(id: string) {
    try {
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
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`findOne campaign ${id} failed`, error);
      throw new InternalServerErrorException('Failed to fetch campaign');
    }
  }

  async update(id: string, dto: UpdateCrowdfundDto) {
    await this.findOne(id);
    try {
      return await this.prisma.crowdfundCampaign.update({ where: { id }, data: dto });
    } catch (error) {
      this.logger.error(`update campaign ${id} failed`, error);
      throw new InternalServerErrorException('Failed to update campaign');
    }
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      return await this.prisma.crowdfundCampaign.delete({ where: { id } });
    } catch (error) {
      this.logger.error(`remove campaign ${id} failed`, error);
      throw new InternalServerErrorException('Failed to delete campaign');
    }
  }

  async donate(campaignId: string, donorId: string, dto: DonateDto) {
    const campaign = await this.findOne(campaignId);
    if (campaign.isCompleted) throw new BadRequestException('This campaign is already completed');

    const newAmount = campaign.currentAmount + dto.amount;
    const isCompleted = newAmount >= campaign.targetAmount;

    try {
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
    } catch (error) {
      this.logger.error(`donate to campaign ${campaignId} failed`, error);
      throw new InternalServerErrorException('Failed to record donation');
    }
  }
}
