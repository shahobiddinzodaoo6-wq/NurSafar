import { baseApi } from "../store/baseApi";
import type { Logistics, UpdateTripStatusPayload } from "../types";

export const logisticsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyTrips: builder.query<Logistics[], void>({
      query: () => "/logistics/my-trips",
      providesTags: ["DriverTrips"],
    }),
    updateTripStatus: builder.mutation<Logistics, UpdateTripStatusPayload>({
      query: ({ id, status }) => ({
        url: `/logistics/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["DriverTrips"],
    }),
  }),
});


export const { useGetMyTripsQuery, useUpdateTripStatusMutation } = logisticsApi;
