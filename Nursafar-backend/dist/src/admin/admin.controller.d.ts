import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    constructor(adminService: AdminService);
    getStats(): Promise<{
        totalUsers: number;
        activeTours: number;
        pendingApprovals: number;
        totalRevenue: number;
    }>;
    getTransactions(): Promise<({
        id: string;
        type: "TOUR";
        user: string;
        description: string;
        amount: number;
        status: string;
        createdAt: Date;
    } | {
        id: string;
        type: "DONATION";
        user: string;
        description: string;
        amount: number;
        status: "SUCCESS";
        createdAt: Date;
    })[]>;
    getChartData(): Promise<{
        date: string;
        revenue: number;
        bookings: number;
    }[]>;
}
