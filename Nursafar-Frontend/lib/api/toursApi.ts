import { baseApi } from "../store/baseApi";

export interface Tour {
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
  partner: { id: string; name: string };
}

export interface Booking {
  id: string;
  userId: string;
  tourId: string;
  status: "PENDING" | "CONFIRMED" | "PAID" | "CANCELLED";
  createdAt: string;
  tour: Tour;
}

interface SearchParams {
  departureCity?: string;
  minPrice?: number;
  maxPrice?: number;
  minStars?: number;
  maxDistance?: number;
}

export const toursApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTours: builder.query<Tour[], void>({
      query: () => "/tours",
      providesTags: ["Tours"],
    }),
    searchTours: builder.query<Tour[], SearchParams>({
      query: (params) => ({
        url: "/tours/search",
        params: Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
        ),
      }),
      providesTags: ["Tours"],
    }),
    getTourById: builder.query<Tour, string>({
      query: (id) => `/tours/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Tours", id }],
    }),
    bookTour: builder.mutation<Booking, string>({
      query: (tourId) => ({ url: `/tours/${tourId}/book`, method: "POST" }),
      invalidatesTags: ["Bookings"],
    }),
    getMyBookings: builder.query<Booking[], void>({
      query: () => "/tours/my/bookings",
      providesTags: ["Bookings"],
    }),
  }),
});

export const {
  useGetToursQuery,
  useSearchToursQuery,
  useGetTourByIdQuery,
  useBookTourMutation,
  useGetMyBookingsQuery,
} = toursApi;
