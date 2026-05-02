import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateLogisticsDto {
  @ApiProperty({ example: 'uuid-booking-456', description: 'ID of the booking associated with this transit' })
  @IsString()
  bookingId: string;

  @ApiProperty({ example: '123 Rudaki Ave, Dushanbe', description: 'Pickup address' })
  @IsString()
  pickupAddress: string;

  @ApiProperty({ example: '2026-06-01T10:00:00Z', description: 'Scheduled pickup time (ISO 8601)' })
  @IsDateString()
  pickupTime: string;

  @ApiProperty({ example: 'uuid-driver-789', required: false, description: 'Assigned driver ID' })
  @IsString()
  @IsOptional()
  driverId?: string;
}
