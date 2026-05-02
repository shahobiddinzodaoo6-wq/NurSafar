import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('stats')
  @ApiOperation({ summary: '[ADMIN] Get platform statistics' })
  @ApiResponse({ status: 200, description: 'Platform stats.' })
  getStats() {
    return this.adminService.getStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: '[ADMIN] Get all transactions (bookings + donations)' })
  @ApiResponse({ status: 200, description: 'All transactions.' })
  getTransactions() {
    return this.adminService.getTransactions();
  }

  @Get('chart')
  @ApiOperation({ summary: '[ADMIN] Get 7-day revenue chart data' })
  @ApiResponse({ status: 200, description: 'Chart data.' })
  getChartData() {
    return this.adminService.getChartData();
  }
}
