import { baseApi } from "../store/baseApi";

export type LogisticsStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED";

export interface DriverTrip {
  id: string;
  pickupAddress: string;
  pickupTime: string;
  status: LogisticsStatus;
  booking: {
    id: string;
    user: { id: string; name: string; phone: string };
    tour: { id: string; title: string };
  };
}

export const driverApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMyTrips: build.query<DriverTrip[], void>({
      query: () => "/logistics/my-trips",
      providesTags: ["DriverTrips"],
    }),

    updateTripStatus: build.mutation<DriverTrip, { id: string; status: LogisticsStatus }>({
      query: ({ id, status }) => ({
        url: `/logistics/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["DriverTrips"],
    }),
  }),
});

export const { useGetMyTripsQuery, useUpdateTripStatusMutation } = driverApi;
