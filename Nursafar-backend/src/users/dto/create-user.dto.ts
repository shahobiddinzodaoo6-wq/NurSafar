import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Firuz Toshmatov', description: 'Full name' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '+992901234567', description: 'Phone number' })
  @IsString()
  @IsOptional()
  phone?: string;
}
