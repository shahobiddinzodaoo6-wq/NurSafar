import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { CrowdfundService } from './crowdfund.service';
import { CreateCrowdfundDto } from './dto/create-crowdfund.dto';
import { UpdateCrowdfundDto } from './dto/update-crowdfund.dto';
import { DonateDto } from './dto/donate.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('crowdfund')
@Controller('crowdfund')
export class CrowdfundController {
  constructor(private readonly crowdfundService: CrowdfundService) {}

  @Get()
  @ApiOperation({ summary: 'Get all crowdfunding campaigns (public)' })
  @ApiResponse({ status: 200, description: 'Return all campaigns.' })
  findAll() {
    return this.crowdfundService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a crowdfunding campaign by ID (public)' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Return the campaign.' })
  @ApiResponse({ status: 404, description: 'Campaign not found.' })
  findOne(@Param('id') id: string) {
    return this.crowdfundService.findOne(id);
  }

  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[AUTH] Create a new crowdfunding campaign' })
  @ApiBody({ type: CreateCrowdfundDto })
  @ApiResponse({ status: 201, description: 'Campaign created.' })
  create(@Body() dto: CreateCrowdfundDto, @CurrentUser() user: any) {
    return this.crowdfundService.create(user.id, dto);
  }

  @Post(':id/donate')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[AUTH] Donate to a crowdfunding campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiBody({ type: DonateDto })
  @ApiResponse({ status: 201, description: 'Donation recorded.' })
  @ApiResponse({ status: 400, description: 'Campaign already completed.' })
  donate(@Param('id') id: string, @Body() dto: DonateDto, @CurrentUser() user: any) {
    return this.crowdfundService.donate(id, user.id, dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[AUTH] Update a crowdfunding campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiBody({ type: UpdateCrowdfundDto })
  @ApiResponse({ status: 200, description: 'Campaign updated.' })
  update(@Param('id') id: string, @Body() dto: UpdateCrowdfundDto) {
    return this.crowdfundService.update(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '[AUTH] Delete a crowdfunding campaign' })
  @ApiParam({ name: 'id', description: 'Campaign ID' })
  @ApiResponse({ status: 200, description: 'Campaign deleted.' })
  remove(@Param('id') id: string) {
    return this.crowdfundService.remove(id);
  }
}
