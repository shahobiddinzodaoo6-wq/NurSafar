import { baseApi } from "../store/baseApi";

export interface AdminStats {
  totalUsers: number;
  activeTours: number;
  pendingApprovals: number;
  totalRevenue: number;
}

export interface ChartPoint {
  date: string;
  revenue: number;
  bookings: number;
}

export interface Transaction {
  id: string;
  type: "TOUR" | "DONATION";
  user: string;
  description: string;
  amount: number;
  status: "SUCCESS" | "PENDING" | "CANCELLED";
  createdAt: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "ADMIN" | "CLIENT" | "PARTNER" | "DRIVER";
  isApproved: boolean;
  createdAt: string;
}

export const adminApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getAdminStats: build.query<AdminStats, void>({
      query: () => "/admin/stats",
      providesTags: ["Stats"],
    }),

    getChartData: build.query<ChartPoint[], void>({
      query: () => "/admin/chart",
      providesTags: ["Stats"],
    }),

    getTransactions: build.query<Transaction[], void>({
      query: () => "/admin/transactions",
      providesTags: ["Transactions"],
    }),

    getPendingPartners: build.query<AdminUser[], void>({
      query: () => "/users/pending-partners",
      providesTags: ["Partners"],
    }),

    approvePartner: build.mutation<AdminUser, string>({
      query: (id) => ({ url: `/users/${id}/approve`, method: "PATCH" }),
      invalidatesTags: ["Partners", "Stats", "Users"],
    }),

    rejectPartner: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Partners", "Stats", "Users"],
    }),

    getAllUsers: build.query<AdminUser[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    deleteUser: build.mutation<void, string>({
      query: (id) => ({ url: `/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["Users", "Stats"],
    }),
  }),
});

export const {
  useGetAdminStatsQuery,
  useGetChartDataQuery,
  useGetTransactionsQuery,
  useGetPendingPartnersQuery,
  useApprovePartnerMutation,
  useRejectPartnerMutation,
  useGetAllUsersQuery,
  useDeleteUserMutation,
} = adminApi;
