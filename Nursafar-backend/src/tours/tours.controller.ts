import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ToursService } from './tours.service';
import { CreateTourDto } from './dto/create-tour.dto';
import { UpdateTourDto } from './dto/update-tour.dto';
import { SearchTourDto } from './dto/search-tour.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('tours')
@Controller('tours')
export class ToursController {
  constructor(private readonly toursService: ToursService) {}

  @Get('search')
  @ApiOperation({ summary: 'Search tours with filters (public)' })
  @ApiResponse({ status: 200, description: 'Filtered list of available tours.' })
  search(@Query() filters: SearchTourDto) {
    return this.toursService.search(filters);
  }

  @Get('partner-tours')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTNER', 'ADMIN')
  @ApiOperation({ summary: '[PARTNER] Get own tours with booking counts' })
  @ApiResponse({ status: 200, description: 'Return partner tours.' })
  partnerTours(@CurrentUser() user: any) {
    return this.toursService.findPartnerTours(user.id);
  }

  @Get('partner-stats')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTNER', 'ADMIN')
  @ApiOperation({ summary: '[PARTNER] Get dashboard stats' })
  @ApiResponse({ status: 200, description: 'Return partner stats.' })
  partnerStats(@CurrentUser() user: any) {
    return this.toursService.getPartnerStats(user.id);
  }

  @Get('partner-clients')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTNER', 'ADMIN')
  @ApiOperation({ summary: '[PARTNER] Get clients who booked own tours' })
  @ApiResponse({ status: 200, description: 'Return partner clients.' })
  partnerClients(@CurrentUser() user: any) {
    return this.toursService.findPartnerClients(user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tours (public)' })
  @ApiResponse({ status: 200, description: 'Return all tours.' })
  findAll() {
    return this.toursService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a tour by ID (public)' })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 200, description: 'Return the tour.' })
  @ApiResponse({ status: 404, description: 'Tour not found.' })
  findOne(@Param('id') id: string) {
    return this.toursService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTNER', 'ADMIN')
  @ApiOperation({ summary: '[PARTNER] Create a new tour' })
  @ApiBody({ type: CreateTourDto })
  @ApiResponse({ status: 201, description: 'Tour created.' })
  create(@Body() dto: CreateTourDto, @CurrentUser() user: any) {
    return this.toursService.create(user.id, dto);
  }

  @Post(':id/book')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[CLIENT] Book a tour' })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 201, description: 'Booking created.' })
  book(@Param('id') id: string, @CurrentUser() user: any) {
    return this.toursService.book(id, user.id);
  }

  @Get('my/bookings')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[CLIENT] Get current user bookings' })
  @ApiResponse({ status: 200, description: 'Return user bookings.' })
  myBookings(@CurrentUser() user: any) {
    return this.toursService.findUserBookings(user.id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTNER', 'ADMIN')
  @ApiOperation({ summary: '[PARTNER] Update a tour' })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiBody({ type: UpdateTourDto })
  @ApiResponse({ status: 200, description: 'Tour updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateTourDto, @CurrentUser() user: any) {
    return this.toursService.update(id, user.id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('PARTNER', 'ADMIN')
  @ApiOperation({ summary: '[PARTNER] Delete a tour' })
  @ApiParam({ name: 'id', description: 'Tour ID' })
  @ApiResponse({ status: 200, description: 'Tour deleted.' })
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.toursService.remove(id, user.id);
  }
}
