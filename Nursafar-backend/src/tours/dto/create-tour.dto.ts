import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsBoolean, IsOptional, Min, Max, IsUrl } from 'class-validator';

export class CreateTourDto {
  @ApiProperty({ example: 'Premium Umrah Package 2026', description: 'Tour title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'A luxurious 14-day Umrah experience...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Dushanbe', description: 'Departure city' })
  @IsString()
  departureCity: string;

  @ApiProperty({ example: 1500, description: 'Price in USD' })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: 5, description: 'Hotel stars (1-5)' })
  @IsNumber()
  @Min(1)
  @Max(5)
  hotelStars: number;

  @ApiProperty({ example: 0.5, description: 'Distance to Haram in km' })
  @IsNumber()
  @Min(0)
  distanceToHaram: number;

  @ApiProperty({ example: 14, description: 'Duration in days', required: false })
  @IsNumber()
  @IsOptional()
  duration?: number;

  @ApiProperty({ example: 'https://example.com/tour.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: true, required: false, description: 'Whether the tour is open for booking' })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;
}
