import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchTourDto {
  @ApiProperty({ example: 'Dushanbe', required: false })
  @IsOptional()
  @IsString()
  departureCity?: string;

  @ApiProperty({ example: 500, required: false, description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @ApiProperty({ example: 3000, required: false, description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @ApiProperty({ example: 4, required: false, description: 'Minimum hotel stars' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(5)
  minStars?: number;

  @ApiProperty({ example: 1.0, required: false, description: 'Max distance to Haram (km)' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxDistance?: number;
}
