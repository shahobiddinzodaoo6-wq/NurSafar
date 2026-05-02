import { CrowdfundService } from './crowdfund.service';
import { CreateCrowdfundDto } from './dto/create-crowdfund.dto';
import { UpdateCrowdfundDto } from './dto/update-crowdfund.dto';
import { DonateDto } from './dto/donate.dto';
export declare class CrowdfundController {
    private readonly crowdfundService;
    constructor(crowdfundService: CrowdfundService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            name: string;
        };
        _count: {
            donations: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        userId: string;
        targetAmount: number;
        currentAmount: number;
        isCompleted: boolean;
    })[]>;
    findOne(id: string): Promise<{
        user: {
            id: string;
            name: string;
        };
        donations: ({
            donor: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            amount: number;
            message: string | null;
            campaignId: string;
            donorId: string;
        })[];
        _count: {
            donations: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        userId: string;
        targetAmount: number;
        currentAmount: number;
        isCompleted: boolean;
    }>;
    create(dto: CreateCrowdfundDto, user: any): Promise<{
        user: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        userId: string;
        targetAmount: number;
        currentAmount: number;
        isCompleted: boolean;
    }>;
    donate(id: string, dto: DonateDto, user: any): Promise<{
        donor: {
            id: string;
            name: string;
        };
    } & {
        id: string;
        createdAt: Date;
        amount: number;
        message: string | null;
        campaignId: string;
        donorId: string;
    }>;
    update(id: string, dto: UpdateCrowdfundDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        userId: string;
        targetAmount: number;
        currentAmount: number;
        isCompleted: boolean;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        userId: string;
        targetAmount: number;
        currentAmount: number;
        isCompleted: boolean;
    }>;
}
