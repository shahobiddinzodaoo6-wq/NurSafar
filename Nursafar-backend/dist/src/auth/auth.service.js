"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AuthService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = __importStar(require("bcrypt"));
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = AuthService_1 = class AuthService {
    prisma;
    jwt;
    logger = new common_1.Logger(AuthService_1.name);
    constructor(prisma, jwt) {
        this.prisma = prisma;
        this.jwt = jwt;
    }
    async register(dto) {
        try {
            const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (existing)
                throw new common_1.ConflictException('Email already registered');
            const phoneExists = await this.prisma.user.findUnique({ where: { phone: dto.phone } });
            if (phoneExists)
                throw new common_1.ConflictException('Phone already registered');
            const hashed = await bcrypt.hash(dto.password, 12);
            const user = await this.prisma.user.create({
                data: {
                    name: dto.name,
                    email: dto.email,
                    phone: dto.phone,
                    password: hashed,
                    role: dto.role,
                    isApproved: dto.role === 'CLIENT',
                },
                select: { id: true, name: true, email: true, phone: true, role: true, createdAt: true },
            });
            const token = this.signToken(user.id, user.email, user.role, user.name);
            return { user, access_token: token };
        }
        catch (error) {
            if (error instanceof common_1.ConflictException)
                throw error;
            this.logger.error('register failed', error instanceof Error ? error.stack : error);
            throw new common_1.InternalServerErrorException('Registration failed — check backend logs for details');
        }
    }
    async login(dto) {
        try {
            const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
            if (!user)
                throw new common_1.UnauthorizedException('Invalid credentials');
            const passwordMatch = await bcrypt.compare(dto.password, user.password);
            if (!passwordMatch)
                throw new common_1.UnauthorizedException('Invalid credentials');
            const token = this.signToken(user.id, user.email, user.role, user.name);
            return {
                user: { id: user.id, name: user.name, email: user.email, role: user.role },
                access_token: token,
            };
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException)
                throw error;
            this.logger.error('login failed', error instanceof Error ? error.stack : error);
            throw new common_1.InternalServerErrorException('Login failed — check backend logs for details');
        }
    }
    signToken(id, email, role, name) {
        return this.jwt.sign({ sub: id, email, role, name });
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = AuthService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map