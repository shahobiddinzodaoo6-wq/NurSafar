import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateCrowdfundDto {
  @ApiProperty({ example: "Help My Parents Go to Umrah", description: 'Campaign title' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'We want to send our elderly parents on the Umrah pilgrimage...', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 2000, description: 'Target amount in USD' })
  @IsNumber()
  @Min(1)
  targetAmount: number;
}
