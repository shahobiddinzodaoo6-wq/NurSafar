import { baseApi } from "../store/baseApi";
import type { Tour, Booking, SearchTourParams } from "../types";

export const toursApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTours: builder.query<Tour[], void>({
      query: () => "/tours",
      providesTags: ["Tours"],
    }),
    searchTours: builder.query<Tour[], SearchTourParams>({
      query: (params) => ({ url: "/tours/search", params }),
      providesTags: ["Tours"],
    }),
    getTourById: builder.query<Tour, string>({
      query: (id) => `/tours/${id}`,
      providesTags: ["Tours"],
    }),
    bookTour: builder.mutation<Booking, string>({
      query: (tourId) => ({
        url: `/tours/${tourId}/book`,
        method: "POST",
      }),
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
