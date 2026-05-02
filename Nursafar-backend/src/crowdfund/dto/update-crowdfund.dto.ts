import { PartialType } from '@nestjs/swagger';
import { CreateCrowdfundDto } from './create-crowdfund.dto';

export class UpdateCrowdfundDto extends PartialType(CreateCrowdfundDto) {}
