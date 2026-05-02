import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
export declare class ToursController {
    private readonly toursService;
    constructor(toursService: ToursService);
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
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
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
    create(dto: CreateTourDto, user: any): Promise<{
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
    book(id: string, user: any): Promise<{
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
    myBookings(user: any): import("@prisma/client").Prisma.PrismaPromise<({
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
    update(id: string, dto: UpdateTourDto, user: any): Promise<{
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
    remove(id: string, user: any): Promise<{
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
}
