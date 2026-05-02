import { Role } from '@prisma/client';
export declare class RegisterDto {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: Exclude<Role, 'ADMIN'>;
}
