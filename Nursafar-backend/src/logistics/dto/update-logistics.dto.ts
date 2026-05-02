import { PartialType } from '@nestjs/swagger';
import { CreateLogisticsDto } from './create-logistics.dto';

export class UpdateLogisticsDto extends PartialType(CreateLogisticsDto) {}
