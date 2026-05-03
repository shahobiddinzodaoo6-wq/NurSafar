"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SeedService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let SeedService = SeedService_1 = class SeedService {
    prisma;
    logger = new common_1.Logger(SeedService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async onApplicationBootstrap() {
        try {
            await this.seedAdmin();
            await this.seedTestAccounts();
        }
        catch (err) {
            this.logger.warn(`Seed skipped — database not ready: ${err.message}`);
        }
    }
    async seedAdmin() {
        const existing = await this.prisma.user.findFirst({ where: { role: 'ADMIN' } });
        if (existing) {
            if (!existing.isApproved) {
                await this.prisma.user.update({ where: { id: existing.id }, data: { isApproved: true } });
                this.logger.log('Admin account approved flag updated');
            }
            return;
        }
        const hashed = await bcrypt.hash('AdminSuperSecret!', 12);
        await this.prisma.user.create({
            data: {
                name: 'NurSafar Admin',
                email: 'admin@nursafar.tj',
                phone: '+992000000000',
                password: hashed,
                role: 'ADMIN',
                isApproved: true,
            },
        });
        this.logger.log('Admin account seeded: admin@nursafar.tj');
    }
    async seedTestAccounts() {
        const agencyExists = await this.prisma.user.findUnique({ where: { email: 'agency@nursafar.tj' } });
        let agency = agencyExists;
        if (!agencyExists) {
            const hashed = await bcrypt.hash('AgencyTest123!', 12);
            agency = await this.prisma.user.create({
                data: {
                    name: 'Dushanbe Umrah Agency',
                    email: 'agency@nursafar.tj',
                    phone: '+992111111111',
                    password: hashed,
                    role: 'PARTNER',
                    isApproved: true,
                },
            });
            this.logger.log('Test agency seeded: agency@nursafar.tj');
            await this.prisma.tour.createMany({
                data: [
                    {
                        partnerId: agency.id,
                        title: 'Premium Umrah Package — 14 Days',
                        description: 'A luxurious 14-day Umrah pilgrimage from Dushanbe, staying in 5-star hotels 200m from the Masjid al-Haram.',
                        departureCity: 'Dushanbe',
                        price: 2500,
                        hotelStars: 5,
                        distanceToHaram: 0.2,
                        duration: 14,
                        imageUrl: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800',
                        isAvailable: true,
                    },
                    {
                        partnerId: agency.id,
                        title: 'Economy Umrah Package — 10 Days',
                        description: 'Affordable 10-day Umrah package departing from Khujand with comfortable 3-star accommodation.',
                        departureCity: 'Khujand',
                        price: 1200,
                        hotelStars: 3,
                        distanceToHaram: 1.5,
                        duration: 10,
                        imageUrl: 'https://images.unsplash.com/photo-1564769662533-4f00a87b4056?w=800',
                        isAvailable: true,
                    },
                    {
                        partnerId: agency.id,
                        title: 'Family Umrah Package — 21 Days',
                        description: 'Extended 21-day family package with guided tours of Madinah and Makkah holy sites.',
                        departureCity: 'Dushanbe',
                        price: 3800,
                        hotelStars: 4,
                        distanceToHaram: 0.5,
                        duration: 21,
                        imageUrl: 'https://images.unsplash.com/photo-1542816417-0983c9c9ad53?w=800',
                        isAvailable: true,
                    },
                ],
            });
            this.logger.log('Sample tours seeded for agency');
        }
        const driverExists = await this.prisma.user.findUnique({ where: { email: 'driver@nursafar.tj' } });
        if (!driverExists) {
            const hashed = await bcrypt.hash('DriverTest123!', 12);
            const driver = await this.prisma.user.create({
                data: {
                    name: 'Alibek Rakhimov',
                    email: 'driver@nursafar.tj',
                    phone: '+992222222222',
                    password: hashed,
                    role: 'DRIVER',
                    isApproved: true,
                },
            });
            this.logger.log('Test driver seeded: driver@nursafar.tj');
            const clientExists = await this.prisma.user.findUnique({ where: { email: 'testclient@nursafar.tj' } });
            let client = clientExists;
            if (!client) {
                const clientHash = await bcrypt.hash('ClientTest123!', 12);
                client = await this.prisma.user.create({
                    data: {
                        name: 'Farrukh Toshmatov',
                        email: 'testclient@nursafar.tj',
                        phone: '+992333333333',
                        password: clientHash,
                        role: 'CLIENT',
                        isApproved: true,
                    },
                });
            }
            const tour = await this.prisma.tour.findFirst({ where: { isAvailable: true } });
            if (tour) {
                const booking = await this.prisma.booking.create({
                    data: { userId: client.id, tourId: tour.id, status: 'CONFIRMED' },
                });
                await this.prisma.logistics.create({
                    data: {
                        bookingId: booking.id,
                        pickupAddress: '12 Rudaki Avenue, Dushanbe',
                        pickupTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
                        driverId: driver.id,
                        status: 'PENDING',
                    },
                });
                this.logger.log('Sample logistics trip seeded for driver');
            }
        }
    }
};
exports.SeedService = SeedService;
exports.SeedService = SeedService = SeedService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SeedService);
//# sourceMappingURL=seed.service.js.map