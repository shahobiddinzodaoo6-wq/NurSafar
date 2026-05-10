import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
  type FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

// ─── 1. Resolve and validate the API URL ──────────────────────────────────────
const RAW_URL = process.env.EXPO_PUBLIC_API_URL;
const PLACEHOLDER_PATTERNS = ["192.168.1.X", "YOUR_IP", "YOUR_COMPUTER_IP"];
const isPlaceholder =
  !RAW_URL || PLACEHOLDER_PATTERNS.some((p) => RAW_URL.includes(p));

if (isPlaceholder) {
  console.warn(
    "\n[NurSafar] ⚠️  EXPO_PUBLIC_API_URL is not configured!\n" +
      "  Steps to fix:\n" +
      "  1. Run `ipconfig` (Windows) and find your IPv4 address\n" +
      "  2. Open nursafar-mobile/.env and set:\n" +
      "       EXPO_PUBLIC_API_URL=http://<YOUR_IPv4>:3001/api\n" +
      "  3. Restart Metro with --clear flag:\n" +
      "       npx expo start --clear\n"
  );
}

// Hardcoded fallback for testing — replace this IP with your machine's LAN IP
const API_URL = RAW_URL ?? "http://192.168.1.100:3001/api";

// ─── 2. Log the active URL on every cold start (visible in Metro terminal) ────
console.log("[NurSafar] API base URL →", API_URL);

// ─── 3. Wrap fetchBaseQuery to log every request and every error ──────────────
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithLogging: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const method =
    typeof args === "string" ? "GET" : (args.method?.toUpperCase() ?? "GET");
  const url = typeof args === "string" ? args : args.url;

  console.log(`[API →] ${method} ${API_URL}${url}`);

  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    console.error(`[API ✗] ${method} ${url} failed:`, JSON.stringify(result.error, null, 2));
  } else {
    console.log(`[API ✓] ${method} ${url} OK`);
  }

  return result;
};

// ─── 4. Export the store ──────────────────────────────────────────────────────
export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithLogging,
  tagTypes: [
    "Tours",
    "Bookings",
    "Campaigns",
    "Donations",
    "Logistics",
    "DriverTrips",
  ],
  keepUnusedDataFor: 300,
  endpoints: () => ({}),
});
