import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
    }[]>;
    findPendingPartners(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateUserDto): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
    }>;
    approveUser(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        phone: string;
        password: string;
        role: import("@prisma/client").$Enums.Role;
        isApproved: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
