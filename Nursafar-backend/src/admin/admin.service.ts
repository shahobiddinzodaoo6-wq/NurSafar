import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [totalUsers, activeTours, pendingApprovals, bookings, donations] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.tour.count({ where: { isAvailable: true } }),
      this.prisma.user.count({ where: { role: { in: ['PARTNER', 'DRIVER'] }, isApproved: false } }),
      this.prisma.booking.findMany({ include: { tour: { select: { price: true } } } }),
      this.prisma.donation.aggregate({ _sum: { amount: true } }),
    ]);

    const tourRevenue = bookings.reduce((sum, b) => sum + (b.tour?.price ?? 0), 0);
    const donationRevenue = donations._sum.amount ?? 0;
    const totalRevenue = tourRevenue + donationRevenue;

    return { totalUsers, activeTours, pendingApprovals, totalRevenue };
  }

  async getTransactions() {
    const [bookings, donations] = await Promise.all([
      this.prisma.booking.findMany({
        include: {
          user: { select: { name: true } },
          tour: { select: { title: true, price: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
      this.prisma.donation.findMany({
        include: {
          donor: { select: { name: true } },
          campaign: { select: { title: true } },
        },
        orderBy: { createdAt: 'desc' },
        take: 100,
      }),
    ]);

    const bookingRows = bookings.map((b) => ({
      id: b.id,
      type: 'TOUR' as const,
      user: b.user.name,
      description: b.tour.title,
      amount: b.tour.price,
      status: b.status === 'PAID' ? 'SUCCESS' : b.status === 'CANCELLED' ? 'CANCELLED' : 'PENDING',
      createdAt: b.createdAt,
    }));

    const donationRows = donations.map((d) => ({
      id: d.id,
      type: 'DONATION' as const,
      user: d.donor.name,
      description: d.campaign.title,
      amount: d.amount,
      status: 'SUCCESS' as const,
      createdAt: d.createdAt,
    }));

    return [...bookingRows, ...donationRows].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  }

  async getChartData() {
    const days = 7;
    const result: { date: string; revenue: number; bookings: number }[] = [];

    for (let i = days - 1; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);

      const end = new Date(start);
      end.setHours(23, 59, 59, 999);

      const [dayBookings, dayDonations] = await Promise.all([
        this.prisma.booking.findMany({
          where: { createdAt: { gte: start, lte: end } },
          include: { tour: { select: { price: true } } },
        }),
        this.prisma.donation.aggregate({
          where: { createdAt: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
      ]);

      const bookingRevenue = dayBookings.reduce((s, b) => s + (b.tour?.price ?? 0), 0);
      const donationRevenue = dayDonations._sum.amount ?? 0;

      result.push({
        date: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: bookingRevenue + donationRevenue,
        bookings: dayBookings.length,
      });
    }

    return result;
  }
}
