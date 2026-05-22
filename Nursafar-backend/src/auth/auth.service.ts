import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    try {
      const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (existing) throw new ConflictException('Email already registered');

      const phoneExists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
      if (phoneExists) throw new ConflictException('Phone already registered');

      const hashed = await bcrypt.hash(dto.password, 12);
      const user = await this.prisma.user.create({
        data: {
          name: dto.name,
          email: dto.email,
          phone: dto.phone,
          password: hashed,
          role: dto.role as any,
          isApproved: dto.role === 'CLIENT',
        },
        select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
      });

      const token = this.signToken(user.id, user.email, user.role, user.name);
      return { user, access_token: token };
    } catch (error) {
      if (error instanceof ConflictException) throw error;
      this.logger.error('register failed', error instanceof Error ? error.stack : error);
      throw new InternalServerErrorException('Registration failed — check backend logs for details');
    }
  }

  async login(dto: LoginDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
      if (!user) throw new UnauthorizedException('Invalid credentials');

      const passwordMatch = await bcrypt.compare(dto.password, user.password);
      if (!passwordMatch) throw new UnauthorizedException('Invalid credentials');

      const token = this.signToken(user.id, user.email, user.role, user.name);
      return {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        access_token: token,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) throw error;
      this.logger.error('login failed', error instanceof Error ? error.stack : error);
      throw new InternalServerErrorException('Login failed — check backend logs for details');
    }
  }

  private signToken(id: string, email: string, role: string, name: string): string {
    return this.jwt.sign({ sub: id, email, role, name });
  }
}
