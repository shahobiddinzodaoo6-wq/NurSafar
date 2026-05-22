import { PrismaService } from '../prisma/prisma.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
export declare class ToursService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    create(partnerId: string, dto: CreateTourDto): Promise<{
        partner: {
            id: string;
            name: string;
            email: string;
        };
    } & {
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
    }>;
    search(filters: SearchTourDto): Promise<({
        partner: {
            id: string;
            name: string;
        };
    } & {
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
    })[]>;
    findAll(): Promise<({
        partner: {
            id: string;
            name: string;
        };
    } & {
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
    })[]>;
    findOne(id: string): Promise<{
        _count: {
            bookings: number;
        };
        partner: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
    } & {
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
    }>;
    update(id: string, partnerId: string, dto: UpdateTourDto): Promise<{
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
    }>;
    remove(id: string, partnerId: string): Promise<{
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
    }>;
    book(tourId: string, userId: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
        };
        tour: {
            title: string;
            departureCity: string;
            price: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        userId: string;
        tourId: string;
    }>;
    findUserBookings(userId: string): Promise<({
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
    })[]>;
    findPartnerTours(partnerId: string): Promise<({
        _count: {
            bookings: number;
        };
    } & {
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
    })[]>;
    getPartnerStats(partnerId: string): Promise<{
        activeTours: number;
        totalClients: number;
        totalRevenue: number;
    }>;
    findPartnerClients(partnerId: string): Promise<({
        user: {
            id: string;
            name: string;
            email: string;
            phone: string;
        };
        tour: {
            id: string;
            title: string;
            price: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import("@prisma/client").$Enums.BookingStatus;
        userId: string;
        tourId: string;
    })[]>;
}
