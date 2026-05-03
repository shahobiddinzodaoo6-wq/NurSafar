import { PrismaService } from '../prisma/prisma.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';
import { UpdateLogisticsDto } from './dto/update-logistics.dto';
import { LogisticsStatus } from '@prisma/client';
export declare class LogisticsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(dto: CreateLogisticsDto): Promise<{
        booking: {
            user: {
                id: string;
                name: string;
            };
            tour: {
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            tourId: string;
        };
        driver: {
            id: string;
            name: string;
            phone: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    }>;
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        booking: {
            user: {
                id: string;
                name: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            tourId: string;
        };
        driver: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    })[]>;
    findOne(id: string): Promise<{
        booking: {
            user: {
                id: string;
                name: string;
            };
            tour: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                title: string;
                departureCity: string;
                price: number;
                hotelStars: number;
                distanceToHaram: number;
                duration: number;
                imageUrl: string | null;
                isAvailable: boolean;
                partnerId: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            tourId: string;
        };
        driver: {
            id: string;
            name: string;
            phone: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    }>;
    update(id: string, dto: UpdateLogisticsDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    }>;
    findByDriver(driverId: string): import("@prisma/client").Prisma.PrismaPromise<({
        booking: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
            tour: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            tourId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    })[]>;
    updateStatus(id: string, driverId: string, status: LogisticsStatus): Promise<{
        booking: {
            user: {
                id: string;
                name: string;
                phone: string;
            };
            tour: {
                id: string;
                title: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import("@prisma/client").$Enums.BookingStatus;
            userId: string;
            tourId: string;
        };
        driver: {
            id: string;
            name: string;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.LogisticsStatus;
        bookingId: string;
        pickupAddress: string;
        pickupTime: Date;
        driverId: string | null;
    }>;
}
