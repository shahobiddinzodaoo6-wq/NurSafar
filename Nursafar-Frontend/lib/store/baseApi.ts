import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL ?? "/api",
    prepareHeaders: (headers) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("nursafar_token");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: ["Tours", "Bookings", "Campaigns", "Donations", "Users", "Logistics", "Partners", "Transactions", "Stats", "PartnerTours", "PartnerStats", "PartnerClients", "DriverTrips"],
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
});
