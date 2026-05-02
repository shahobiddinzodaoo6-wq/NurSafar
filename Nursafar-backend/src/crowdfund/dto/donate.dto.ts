import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DonateDto {
  @ApiProperty({ example: 50, description: 'Donation amount in USD' })
  @IsNumber()
  @Min(1)
  amount: number;

  @ApiProperty({ example: 'Sending love and prayers!', required: false })
  @IsString()
  @IsOptional()
  message?: string;
}
