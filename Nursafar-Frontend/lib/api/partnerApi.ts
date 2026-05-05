import { baseApi } from "../store/baseApi";

export interface PartnerStats {
  activeTours: number;
  totalClients: number;
  totalRevenue: number;
}

export interface TourWithCount {
  id: string;
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
  _count: { bookings: number };
}

export interface ClientBooking {
  id: string;
  status: "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED";
  createdAt: string;
  user: { id: string; name: string; email: string; phone: string };
  tour: { id: string; title: string; price: number };
}

export interface CreateTourPayload {
  title: string;
  description?: string;
  departureCity: string;
  duration?: number;
  hotelStars: number;
  distanceToHaram: number;
  imageUrl?: string;
  price: number;
  isAvailable?: boolean;
}

export const partnerApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPartnerStats: build.query<PartnerStats, void>({
      query: () => "/tours/partner-stats",
      providesTags: ["PartnerStats"],
    }),

    getPartnerTours: build.query<TourWithCount[], void>({
      query: () => "/tours/partner-tours",
      providesTags: ["PartnerTours"],
    }),

    getPartnerClients: build.query<ClientBooking[], void>({
      query: () => "/tours/partner-clients",
      providesTags: ["PartnerClients"],
    }),

    createPartnerTour: build.mutation<TourWithCount, CreateTourPayload>({
      query: (body) => ({ url: "/tours", method: "POST", body }),
      invalidatesTags: ["PartnerTours", "PartnerStats", "Tours"],
    }),

    updatePartnerTour: build.mutation<TourWithCount, { id: string; body: Partial<CreateTourPayload> }>({
      query: ({ id, body }) => ({ url: `/tours/${id}`, method: "PATCH", body }),
      invalidatesTags: ["PartnerTours", "PartnerStats"],
    }),

    deletePartnerTour: build.mutation<void, string>({
      query: (id) => ({ url: `/tours/${id}`, method: "DELETE" }),
      invalidatesTags: ["PartnerTours", "PartnerStats"],
    }),
  }),
});

export const {
  useGetPartnerStatsQuery,
  useGetPartnerToursQuery,
  useGetPartnerClientsQuery,
  useCreatePartnerTourMutation,
  useUpdatePartnerTourMutation,
  useDeletePartnerTourMutation,
} = partnerApi;
