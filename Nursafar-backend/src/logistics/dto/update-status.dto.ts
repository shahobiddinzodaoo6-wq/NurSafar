import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { LogisticsStatus } from '@prisma/client';

export class UpdateStatusDto {
  @ApiProperty({ enum: LogisticsStatus, example: LogisticsStatus.IN_PROGRESS })
  @IsEnum(LogisticsStatus)
  status: LogisticsStatus;
}
