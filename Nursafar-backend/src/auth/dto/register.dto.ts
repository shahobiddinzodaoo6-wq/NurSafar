import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsString, MinLength, IsPhoneNumber } from 'class-validator';
import { Role } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Firuz Toshmatov', description: 'Full name' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '+992901234567', description: 'Phone number' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'MyPassword123!', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({
    example: 'CLIENT',
    enum: ['CLIENT', 'PARTNER', 'DRIVER'],
    description: 'User role (ADMIN cannot self-register)',
  })
  @IsEnum(['CLIENT', 'PARTNER', 'DRIVER'])
  role: Exclude<Role, 'ADMIN'>;
}
