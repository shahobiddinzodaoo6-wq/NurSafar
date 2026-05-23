// ─── Enums (match Prisma schema exactly) ──────────────────────────────────────

export type Role = "ADMIN" | "CLIENT" | "PARTNER" | "DRIVER";
export type BookingStatus = "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED";
export type LogisticsStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
}


export interface JwtPayload {
  sub: string;
  email: string;
  role: Role;
  name: string;
  iat: number;
  exp: number;
}


export interface AuthResponse {
  user: AuthUser;
  access_token: string;
}


export interface LoginRequest {
  email: string;
  password: string;
}


export interface RegisterRequest {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: Exclude<Role, "ADMIN">;
}


// ─── User ─────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Tour ─────────────────────────────────────────────────────────────────────

export interface Tour {
  id: string;
  partnerId: string;
  title: string;
  description?: string;
  departureCity: string;
  price: number;
  hotelStars: number;
  distanceToHaram: number;
  duration: number;
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SearchTourParams {
  departureCity?: string;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  maxDistance?: number;
}

// ─── Booking ──────────────────────────────────────────────────────────────────

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  tour?: Tour;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// ─── Crowdfund ────────────────────────────────────────────────────────────────

export interface CrowdfundCampaign {
  id: string;
  userId: string;
  title: string;
  description?: string;
  targetAmount: number;
  currentAmount: number;
  isCompleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignDetail extends CrowdfundCampaign {
  donations: Donation[];
}

export interface Donation {
  id: string;
  campaignId: string;
  donorId: string;
  amount: number;
  message?: string;
  createdAt: string;
}

export interface CreateCampaignPayload {
  title: string;
  description?: string;
  targetAmount: number;
}

export interface DonatePayload {
  id: string;
  amount: number;
  message?: string;
}

// ─── Logistics / Driver ───────────────────────────────────────────────────────

export interface Logistics {
  id: string;
  bookingId: string;
  booking?: Booking & {
    tour?: Tour;
    user?: Pick<User, "id" | "name" | "phone">;
  };
  pickupAddress: string;
  pickupTime: string;
  driverId?: string;
  status: LogisticsStatus;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateTripStatusPayload {
  id: string;
  status: LogisticsStatus;
}
