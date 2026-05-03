import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    try {
      await this.seedAdmin();
      await this.seedTestAccounts();
    } catch (err) {
      this.logger.warn(`Seed skipped — database not ready: ${err.message}`);
    }
  }

  private async seedAdmin() {
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

  private async seedTestAccounts() {
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

      // Seed sample tours for the agency
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

      // Seed a test client and booking so the driver has trips to show
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

      // Find an existing tour to book, or use the agency's tour
      const tour = await this.prisma.tour.findFirst({ where: { isAvailable: true } });
      if (tour) {
        const booking = await this.prisma.booking.create({
          data: { userId: client.id, tourId: tour.id, status: 'CONFIRMED' },
        });
        // Create a logistics trip for the driver
        await this.prisma.logistics.create({
          data: {
            bookingId: booking.id,
            pickupAddress: '12 Rudaki Avenue, Dushanbe',
            pickupTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 hours from now
            driverId: driver.id,
            status: 'PENDING',
          },
        });
        this.logger.log('Sample logistics trip seeded for driver');
      }
    }
  }
}
