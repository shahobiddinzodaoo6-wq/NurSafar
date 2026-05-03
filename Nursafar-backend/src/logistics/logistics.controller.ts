import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { LogisticsService } from './logistics.service';
import { CreateLogisticsDto } from './dto/create-logistics.dto';
import { UpdateLogisticsDto } from './dto/update-logistics.dto';
import { UpdateStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('logistics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('logistics')
export class LogisticsController {
  constructor(private readonly logisticsService: LogisticsService) {}

  @Post()
  @ApiOperation({ summary: '[AUTH] Create a logistics/transit booking' })
  @ApiBody({ type: CreateLogisticsDto })
  @ApiResponse({ status: 201, description: 'Logistics booking created.' })
  create(@Body() dto: CreateLogisticsDto) {
    return this.logisticsService.create(dto);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[ADMIN] Get all logistics bookings' })
  @ApiResponse({ status: 200, description: 'Return all logistics bookings.' })
  findAll() {
    return this.logisticsService.findAll();
  }

  @Get('my-trips')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  @ApiOperation({ summary: '[DRIVER] Get assigned trips' })
  @ApiResponse({ status: 200, description: 'Return driver assigned trips.' })
  myTrips(@CurrentUser() user: any) {
    return this.logisticsService.findByDriver(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a logistics booking by ID' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiResponse({ status: 200, description: 'Return the logistics booking.' })
  @ApiResponse({ status: 404, description: 'Logistics booking not found.' })
  findOne(@Param('id') id: string) {
    return this.logisticsService.findOne(id);
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('DRIVER')
  @ApiOperation({ summary: '[DRIVER] Update trip status' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiBody({ type: UpdateStatusDto })
  @ApiResponse({ status: 200, description: 'Trip status updated.' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateStatusDto, @CurrentUser() user: any) {
    return this.logisticsService.updateStatus(id, user.id, dto.status);
  }

  @Patch(':id')
  @ApiOperation({ summary: '[AUTH] Update a logistics booking' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiBody({ type: UpdateLogisticsDto })
  @ApiResponse({ status: 200, description: 'Logistics booking updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateLogisticsDto) {
    return this.logisticsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: '[ADMIN] Delete a logistics booking' })
  @ApiParam({ name: 'id', description: 'Logistics ID' })
  @ApiResponse({ status: 200, description: 'Logistics booking deleted.' })
  remove(@Param('id') id: string) {
    return this.logisticsService.remove(id);
  }
}
